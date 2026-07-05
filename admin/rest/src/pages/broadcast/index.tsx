import { admin } from "@/utils/auth-utils";
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from "@/components/common/card";
import PageHeading from "@/components/common/page-heading";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/text-area";
import FileInput from "@/components/ui/file-input";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/button";
import { useCreateBroadcastMutation } from "@/data/broadcast";
import { yupResolver } from "@hookform/resolvers/yup";
import { broadcastValidationSchema } from "@/components/broadcast/broadcast-validation-schema";
import { useState } from "react";

export default function BroadCast() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(0);
    const {
        control,
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(broadcastValidationSchema),
    });
    const { mutate: createBroadcast } = useCreateBroadcastMutation();
    const onSubmit = (values: any) => {
        setLoading(true);
        createBroadcast(values, {
            onSuccess: () => {
                setLoading(false);
                reset();
                setFileInputKey(prevKey => prevKey + 1);
            },
            onError: () => {
                setLoading(false);
            },
        });
    }

    return (
        <>
            <div className="container mx-auto p-6">
                <Card className="shadow-lg">
                    <PageHeading title={t('form:input-label-broadcast')} className="mb-6" />
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Input
                            label={t('form:input-label-name')}
                            {...register('subject')}
                            error={errors.subject?.message}
                            className="w-full"
                        />

                        <TextArea
                            label={t('form:input-label-description')}
                            {...register('message')}
                            error={errors.message?.message}
                            className="w-full"
                        />

                        <FileInput
                            key={fileInputKey}
                            name="image"
                            control={control}
                            multiple={false}
                        />

                        <div className="text-right">
                            <Button type="submit" size="medium" className="text-sm md:text-base" loading={loading}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}

BroadCast.authenticate = {
    permissions: admin,
};

BroadCast.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
    },
});