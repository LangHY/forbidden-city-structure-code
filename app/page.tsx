export default function Page() {
  return (
    <iframe
      src="/opening.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      allowFullScreen
    />
  );
}
