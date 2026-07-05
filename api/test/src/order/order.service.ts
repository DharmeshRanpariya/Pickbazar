import * as PDFDocument from 'pdfkit';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Order,
  OrderStatusType,
  PaymentGatewayType,
  PaymentStatusType,
} from './entities/order.entity';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { v4 as uuidv4 } from 'uuid';
import { pagination } from 'src/common/pagination/pagination';
import { S3 } from 'aws-sdk';
import { PassThrough } from 'stream';
import { FlashSaleService } from 'src/flash-sale/flash-sale.service';
import { ConfigService } from '@nestjs/config';
const Razorpay = require('razorpay');
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import {
  CheckoutVerificationDto,
  VerifiedCheckoutData,
} from './dto/verify-checkout.dto';

@Injectable()
export class OrderService {
  private razorpay: any;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly flashSaleService: FlashSaleService,
    private configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async create(userId: string, createOrderDto: any): Promise<Order> {
    const { items, totalPrice } = await this.cartService.findAll(userId);
    if (!items.length) {
      throw new BadRequestException('Cart is empty');
    }
    const trackingNumber = uuidv4();

    const activeFlashSales = await this.flashSaleService.findActiveFlashSales();
    const orderItems = await Promise.all(
      items.map(async (item, index) => {
        const productInDto = createOrderDto.products[index];
        let productId: string;
        let variationOptionsId: string | undefined;
        let id = item.product._id.toString();

        if (id.includes('.')) {
          [productId, variationOptionsId] = id.split('.');
        } else {
          productId = id;
        }

        item.product._id = productId;
        item.product.variationOptionsId = variationOptionsId;

        const product = await this.productService.findOne(productId, false);
        if (!product) {
          throw new NotFoundException(`Product not found`);
        }

        let price = 0;
        let variationOption = null;

        if (product.product_type === 'simple') {
          if (product.quantity < item.quantity) {
            throw new BadRequestException(
              `Not enough stock for ${product.name}`,
            );
          }

          product.quantity -= item.quantity;
          await this.productService.update(
            (product as any)._id.toString(),
            product,
          );

          price = product.price;
        } else if (product.product_type === 'variable') {
          variationOption = product.variationOptions.find(
            (option) =>
              (option as any)._id.toString() ===
              productInDto?.variationOptionsId,
          );

          if (!variationOption) {
            throw new NotFoundException(`Variation option not found`);
          }
          if (variationOption.quantity < item.quantity) {
            throw new BadRequestException(
              `Not enough stock for ${variationOption.title}`,
            );
          }

          variationOption.quantity -= item.quantity;
          await this.productService.update(
            (product as any)._id.toString(),
            product,
          );

          price = variationOption.price;
        }

        const productForOrder = {
          ...item.product,
          price,
          variations: product.variations || [],
          variationOptions: variationOption ? [variationOption] : [],
        };

        return {
          userId: userId,
          product: productForOrder,
          quantity: item.quantity,
          total: productInDto.subtotal,
          price: price,
          trackingNumber,
        };
      }),
    );

    const flashSaleDiscount = activeFlashSales
      .flatMap((sale) => {
        return items.map((item) => {
          if (sale.type === 'fixrate') {
            return sale.rate * item.quantity;
          } else {
            return (
              ((item.product.sale_price * sale.rate) / 100) * item.quantity
            );
          }
        });
      })
      .flat()
      .reduce((acc, curr) => acc + curr, 0);

    const orderStatus =
      createOrderDto.paymentGateway === PaymentGatewayType.RAZORPAY
        ? OrderStatusType.PENDING
        : OrderStatusType.PLACED;

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      customer: userId,
      items: orderItems,
      amount: totalPrice,
      flashSaleDiscount,
      trackingNumber,
      orderStatus,
    });
    
    const order = await createdOrder.save();

    await this.cartService.clearCart(userId);

    return order;
  }

  async findAll({
    page,
    limit,
    orderBy,
    sortedBy,
    trackingNumber,
    orderStatus,
    paymentGateway,
  }): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filter: any = {};
    if (trackingNumber) {
      filter.trackingNumber = { $regex: trackingNumber, $options: 'i' };
    }

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentGateway) {
      filter.paymentGateway = paymentGateway;
    }

    const sort: any = {};
    sort[orderBy] = sortedBy === 'desc' ? -1 : 1;

    const totalItems = await this.orderModel.countDocuments(filter).exec();

    const orders = await this.orderModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .populate('customer')
      .exec();

    return {
      data: orders,
      ...pagination(totalItems, page, limit, orders.length),
    };
  }

  async cancelOrder(
    orderId: string,
    userId: string,
    cancelReason?: string,
    cancelDescription?: string,
  ): Promise<Order> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel.findOne({
      _id: orderId,
      customer: userId,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (
      order.orderStatus === OrderStatusType.COMPLETED ||
      order.orderStatus === OrderStatusType.CANCELLED ||
      order.orderStatus === OrderStatusType.REFUNDED
    ) {
      throw new BadRequestException(
        `Order cannot be canceled in its current state`,
      );
    }

    order.orderStatus = OrderStatusType.CANCELLED;
    order.cancelReason = cancelReason || 'No reason provided';
    order.cancelDescription = cancelDescription || '';

    try {
      await order.save();
    } catch (error) {
      console.error('Error saving order:', error);
      throw new BadRequestException('Failed to save order: ' + error.message);
    }

    return order;
  }

  async getTotalRevenueAndOrderCount(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    todayTotalOrderByStatus: Record<OrderStatusType, number>;
    weeklyTotalOrderByStatus: Record<OrderStatusType, number>;
    monthlyTotalOrderByStatus: Record<OrderStatusType, number>;
    yearlyTotalOrderByStatus: Record<OrderStatusType, number>;
    totalYearSaleByMonth: Array<{ total: number; month: string }>;
  }> {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const totalRevenueData = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$paidTotal' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;
    const totalOrders = totalRevenueData[0]?.totalOrders || 0;

    const todayTotalOrderByStatus = await this.getOrdersByStatus(
      startOfToday,
      endOfToday,
    );

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const weeklyTotalOrderByStatus = await this.getOrdersByStatus(startOfWeek);
    const monthlyTotalOrderByStatus =
      await this.getOrdersByStatus(startOfMonth);
    const yearlyTotalOrderByStatus = await this.getOrdersByStatus(startOfYear);

    const salesByMonth = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: new Date(today.getFullYear() + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          total: { $sum: '$paidTotal' },
        },
      },
    ]);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const totalYearSaleByMonth = months.map((month, index) => {
      const saleData = salesByMonth.find(
        (sale) => sale._id.month === index + 1,
      );
      return {
        total: saleData ? saleData.total : 0,
        month,
      };
    });

    return {
      totalRevenue,
      totalOrders,
      todayTotalOrderByStatus,
      weeklyTotalOrderByStatus,
      monthlyTotalOrderByStatus,
      yearlyTotalOrderByStatus,
      totalYearSaleByMonth,
    };
  }

  private async getOrdersByStatus(
    startDate: Date,
    endDate?: Date,
  ): Promise<Record<OrderStatusType, number>> {
    const matchCondition: any = { createdAt: { $gte: startDate } };

    if (endDate) {
      matchCondition.createdAt.$lt = endDate;
    }

    const orderCounts = await this.orderModel.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    return this.formatOrderCounts(orderCounts);
  }

  private formatOrderCounts(
    orderCounts: any[],
  ): Record<OrderStatusType, number> {
    const counts: Record<OrderStatusType, number> = {
      [OrderStatusType.PLACED]: 0,
      [OrderStatusType.PENDING]: 0,
      [OrderStatusType.PROCESSING]: 0,
      [OrderStatusType.COMPLETED]: 0,
      [OrderStatusType.CANCELLED]: 0,
      [OrderStatusType.REFUNDED]: 0,
      [OrderStatusType.FAILED]: 0,
      [OrderStatusType.AT_LOCAL_FACILITY]: 0,
      [OrderStatusType.OUT_FOR_DELIVERY]: 0,
    };

    orderCounts.forEach((item) => {
      const status = item._id as OrderStatusType;
      if (counts.hasOwnProperty(status)) {
        counts[status] = item.count;
      }
    });

    return counts;
  }

  async findOne(id: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel
      .findById(id)
      .populate('customer')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByUserId(
    userId: string,
    { page, limit, orderBy, sortedBy },
  ): Promise<any> {
    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    page = Math.max(1, Math.floor(page));
    limit = Math.max(1, Math.floor(limit));

    const filter: any = { customer: userId };

    const sort: any = {};
    sort[orderBy] = sortedBy === 'desc' ? -1 : 1;

    const totalItems = await this.orderModel.countDocuments(filter).exec();

    const orders = await this.orderModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
      .populate('customer')
      .exec();

    return {
      data: orders,
      ...pagination(totalItems, page, limit, orders.length),
    };
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Order> {
    const order = await this.orderModel
      .findOne({ trackingNumber })
      .populate('customer')
      .exec();

    if (!order) {
      throw new NotFoundException(
        `Order with tracking number ${trackingNumber} not found`,
      );
    }
    return order;
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    const existingOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return existingOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async generateOrderPdf(_id: string): Promise<string> {
    const order = await this.orderModel
      .findById({ _id })
      .populate('customer')
      .populate('items.product')
      .exec();

    if (!order) {
      throw new Error(`Order with tracking number ${_id} not found`);
    }

    // Create a PDF document
    const doc = new PDFDocument();
    const pdfStream = new PassThrough();
    doc.pipe(pdfStream);

    // Document Metadata
    doc.fontSize(11).font('Helvetica').text(`Invoice No: ${order._id}`, 50, 40);
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 40);

    // Customer Details
    doc.fontSize(15).font('Helvetica-Bold').text('Customer', 50, 70);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${order?.customerName || order.customer.name}`, 50, 90);
    doc.text(`${order.customer.email || ''}`, 50, 103);
    doc.text(
      `${order?.customerContact || order.customer.phoneNumber}`,
      50,
      116,
    );
    doc.text(`${order.shippingAddress.street_address}`, 50, 129);
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      50,
      152,
    );
    doc.text(`${order.shippingAddress.zip}`, 50, 165);

    // Shop Details
    doc.fontSize(15).font('Helvetica-Bold').text('Pickbazar', 400, 70);
    doc.fontSize(10).font('Helvetica').text('Pickbazar Shop', 400, 90);
    doc.text('Pickbazar@gmail.com', 400, 103);
    doc.text(`+91 73830 84769`, 400, 116);
    doc.text('1234 Market St', 400, 129);

    // Product Table
    let tableTop = 200;
    const rowHeight = 25;
    const colWidth = [150, 100, 100, 100];
    const pageHeight = doc.page.height;
    const bottomMargin = 50;

    // Calculate available space for products and footer
    const availableSpace = pageHeight - tableTop - rowHeight - bottomMargin;
    const totalRows = order.items.length;
    const rowsThatFit = Math.floor(availableSpace / rowHeight);

    // Draw header background and borders
    doc.fillColor('#00a60f');
    doc
      .rect(
        50,
        tableTop,
        colWidth.reduce((a, b) => a + b, 0),
        rowHeight,
      )
      .fill();

    // Draw column borders
    doc.lineWidth(0.5);
    let x = 50;
    for (let i = 0; i < colWidth.length; i++) {
      if (i > 0) {
        doc
          .moveTo(x, tableTop)
          .lineTo(x, tableTop + rowHeight)
          .stroke('black');
      }
      x += colWidth[i];
    }
    doc
      .moveTo(50, tableTop + rowHeight)
      .lineTo(50 + colWidth.reduce((a, b) => a + b, 0), tableTop + rowHeight)
      .stroke('black');

    // Header text
    doc.fillColor('white').fontSize(10).font('Helvetica-Bold');
    doc.text('Product', 55, tableTop + 7);
    doc.text('Quantity', 230, tableTop + 7);
    doc.text('Price', 330, tableTop + 7);
    doc.text('Subtotal', 455, tableTop + 7);

    doc.font('Helvetica').fillColor('black'); // Reset font and color for the body

    // Draw table rows with column borders
    let productIndex = 0;
    order.items.forEach((item, index) => {
      let y = tableTop + rowHeight + productIndex * rowHeight;

      // Check if a new page is needed
      if (y + rowHeight + 2 * rowHeight > pageHeight - bottomMargin) {
        doc.addPage();
        productIndex = 0;
        tableTop = 50;
        y = tableTop + rowHeight;
        // Redraw the header on the new page
        doc.fillColor('#00a60f');
        doc
          .rect(
            50,
            tableTop,
            colWidth.reduce((a, b) => a + b, 0),
            rowHeight,
          )
          .fill();

        doc.lineWidth(0.5);
        let x = 50;
        for (let i = 0; i < colWidth.length; i++) {
          if (i > 0) {
            doc
              .moveTo(x, tableTop)
              .lineTo(x, tableTop + rowHeight)
              .stroke('black');
          }
          x += colWidth[i];
        }
        doc
          .moveTo(50, tableTop + rowHeight)
          .lineTo(
            50 + colWidth.reduce((a, b) => a + b, 0),
            tableTop + rowHeight,
          )
          .stroke('black');

        doc.fillColor('white').fontSize(10).font('Helvetica-Bold');
        doc.text('Product', 55, tableTop + 7);
        doc.text('Quantity', 230, tableTop + 7);
        doc.text('Price', 330, tableTop + 7);
        doc.text('Subtotal', 455, tableTop + 7);

        doc.font('Helvetica').fillColor('black');
      }

      const rowY = tableTop + rowHeight + productIndex * rowHeight;

      // Draw borders for each cell in the row
      for (let i = 0; i < colWidth.length; i++) {
        const cellX = 50 + colWidth.slice(0, i).reduce((a, b) => a + b, 0);
        doc.lineWidth(0.5);

        if (i > 0) {
          doc
            .moveTo(cellX, rowY)
            .lineTo(cellX, rowY + rowHeight)
            .stroke();
        }
        if (i < colWidth.length - 1) {
          doc
            .moveTo(cellX + colWidth[i], rowY)
            .lineTo(cellX + colWidth[i], rowY + rowHeight)
            .stroke();
        }
        doc
          .moveTo(cellX, rowY + rowHeight)
          .lineTo(cellX + colWidth[i], rowY + rowHeight)
          .stroke();
      }

      doc.text(item.product.name, 55, rowY + 7);
      doc.text(item.quantity.toString(), 240, rowY + 7);
      doc.text(`${item.product.sale_price}`, 335, rowY + 7);
      doc.text(`${item.quantity * item.product.sale_price}`, 465, rowY + 7);

      productIndex++;
    });

    // Calculate the Y position for the footer and its height
    let footerY = tableTop + rowHeight + productIndex * rowHeight + 30;
    const footerHeight = 5 * 15; // Assuming 5 lines for the footer items and 15 is the lineHeight
    const spaceLeftOnPage = pageHeight - footerY - bottomMargin;

    // Check if footer fits on the current page, otherwise move to the next page
    if (spaceLeftOnPage < footerHeight) {
      doc.addPage();
      tableTop = 50;
      footerY = tableTop; // Reset footerY to the top of the new page
    }

    // Footer
    const marginLeft = 350;
    const labelWidth = 100;
    const lineHeight = 15;
    const items = [
      { label: 'Amount:', value: `${order.amount}` },
      { label: 'Coupon Discount:', value: `${order.discount}` },
      { label: 'Flash sale Discount:', value: `${order.flashSaleDiscount}` },
      { label: 'Tax:', value: `${order.salesTax}` },
      { label: 'Shipping:', value: `${order.deliveryFee}` },
      { label: 'Total:', value: `${order.paidTotal}`, bold: true },
    ];

    items.forEach((item, index) => {
      const yPosition = footerY + index * lineHeight;
      if (item.bold) {
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .text(item.label.padEnd(labelWidth), marginLeft, yPosition)
          .text(item.value, marginLeft + labelWidth + 10, yPosition);
        doc.font('Helvetica');
      } else {
        doc
          .text(item.label.padEnd(labelWidth), marginLeft, yPosition)
          .text(item.value, marginLeft + labelWidth + 10, yPosition);
      }
    });

    // Finalize the PDF
    doc.end();

    // Upload to S3
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const s3UploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `pdfs/invoice_${_id}.pdf`,
      Body: pdfStream,
      ContentType: 'application/pdf',
    };

    try {
      const uploadResult = await s3.upload(s3UploadParams).promise();
      await this.orderModel.updateOne(
        { _id },
        { invoiceUrl: uploadResult.Location },
      );
      return uploadResult.Location;
    } catch (error) {
      console.error('Error uploading PDF to S3', error);
      throw new Error('Could not upload PDF to S3');
    }
  }

  async checkout(amount: number, currency: string = 'INR') {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    try {
      // Create an order using Razorpay's orders API
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new HttpException(
        'Unable to create Razorpay order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  verifyCheckout(input: CheckoutVerificationDto): VerifiedCheckoutData {
    return {
      total_tax: 0,
      shipping_charge: 0,
      unavailable_products: [],
      wallet_currency: 0,
      wallet_amount: 0,
    };
  }

  async verifyPayment(body: any): Promise<any> {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    const generatedBody = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.get<string>('RAZORPAY_KEY_SECRET'),
      )
      .update(generatedBody)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      // Save payment information to the database
      const payment = await this.orderModel
        .findOneAndUpdate(
          { _id: orderId },
          {
            razorpayOrderId: await bcrypt.hash(razorpay_order_id, 12),
            razorpayPaymentId: await bcrypt.hash(razorpay_payment_id, 12),
            razorpaySignature: await bcrypt.hash(razorpay_signature, 12),
            paymentStatus: `${PaymentStatusType.SUCCESS}`,
            orderStatus: `${OrderStatusType.PLACED}`,
          },
          { new: true },
        )
        .exec();

      return {
        success: true,
        payment,
        redirectUrl: `${process.env.BASE_URL}`,
      };
    } else {
      throw new HttpException(
        'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
