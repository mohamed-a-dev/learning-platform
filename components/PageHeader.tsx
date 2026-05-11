type Props = {
    title: string,
    description: string
}

const PageHeader = ({ title, description }: Props) => {
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {title}
            </h1>

            <p className="text-gray-500 mt-2">
                {description}
            </p>
        </div>
    );
};

export default PageHeader;