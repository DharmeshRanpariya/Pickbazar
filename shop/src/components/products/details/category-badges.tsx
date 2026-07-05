import Router from 'next/router';
import { useTranslation } from 'next-i18next';
interface Props {
  categories: any;
  basePath: string;
  onClose?: () => void;
}

const CategoryBadges = ({ categories }: Props) => {
  const { t } = useTranslation('common');
  return (
    <div className="mt-4 flex w-full flex-row items-start border-t border-border-200 border-opacity-60 pt-4 md:mt-6 md:pt-6">
      <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
        {t('text-categories')}
      </span>
      <div className="flex flex-row flex-wrap">
        {categories?.map((category: any) => (
          <div
            key={category._id}
            className="mb-2 whitespace-nowrap rounded border border-border-200 bg-transparent py-1 px-2.5 text-sm lowercase tracking-wider text-heading transition-colors  focus:bg-opacity-100 focus:outline-0 ltr:mr-2 rtl:ml-2"
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBadges;
