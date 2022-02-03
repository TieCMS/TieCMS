import Footer from "./components/Footer";
import Blogs from "./components/HomeComponents/Blogs";
import Hero from "./components/HomeComponents/Hero";
import News from "./components/HomeComponents/News";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div className="flex flex-col w-full items-center">
      <Navbar />
      <Hero />
      <News />
      <Blogs />
      <Footer />
    </div>
  );
}

// Setup(like a wizzard for Database, Default User etc), Homepage(loremipsum is good), Userpage (user dashboard), Shop, Forum, News, Blog, Admin Page (admin dashboard), Email templates (like, register info, password reset, news etc)
export default App;
