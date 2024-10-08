import Header from "../components/Header";
import MainImage from "../components/MainImage";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header />
      <MainImage />
      <Footer />
    </main>
  );
}
