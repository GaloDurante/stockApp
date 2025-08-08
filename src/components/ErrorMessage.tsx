export default function ErrorMessage({ title, text }: { title: string; text: string }) {
    return (
        <div className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-semibold mb-4">{title}</h1>
            <p className="max-w-md text-center text-muted">{text}</p>
        </div>
    );
}
