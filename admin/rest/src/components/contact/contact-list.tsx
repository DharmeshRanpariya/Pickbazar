import Pagination from '@/components/ui/pagination';
import { Table, AlignType } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Contact, MappedPaginatorInfo } from '@/types';
import { useIsRTL } from '@/utils/locals';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { Routes } from '@/config/routes';

type IProps = {
  contact: Contact[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
};

const ContactList = ({ contact, paginatorInfo, onPagination }: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft } = useIsRTL();

  let columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'cursor-pointer',
      align: alignLeft,
      width: 220,
      render: (name: string) => (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium ms-2.5">{name}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      align: 'center' as AlignType,
      render: (email: string) => (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium ms-2.5">{email}</span>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center' as AlignType,
      width: 160,
      render: (subject: string) => (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium ms-2.5">
            {subject}
          </span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center' as AlignType,
      width: 160,
      render: (description: string) => (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium ms-2.5">
            {description}
          </span>
        </div>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (slug: string, record: Contact) => (
        <LanguageSwitcher
          // slug={slug}
          record={record}
          deleteModalView="DELETE_CONTACT"
          routes={Routes?.contact}
        />
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter(
      (col) => col?.key !== 'approve' && col?.key !== 'actions',
    );
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          data={contact}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default ContactList;
