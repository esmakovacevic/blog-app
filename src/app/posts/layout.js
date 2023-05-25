import Navbar from "../components/Navbar";

export default function PostsLayout({ children }) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
