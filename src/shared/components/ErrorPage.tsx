export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <h1 className="text-4xl font-bold text-destructive mb-4">Oops!</h1>
      <p className="text-lg text-foreground mb-2">Something went wrong.</p>
      <p className="text-muted-foreground">
        Please try refreshing the page or return to the homepage.
      </p>
    </div>
  );
}