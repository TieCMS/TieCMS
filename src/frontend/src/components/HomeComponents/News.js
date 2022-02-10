import { LazyLoadImage as Image } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const latestNews = [
  {
    title: "Lorem ipsum",
    img: "https://picsum.photos/id/1001/400/450",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: false,
  },
  {
    title: "Latest update",
    img: "https://picsum.photos/id/1002/400/250",
    description:
      "Rerum reiciendis beatae tenetur exce voluptates incidunt iure sapiente",
    featured: false,
  },
  {
    title: "New news by newt",
    img: "https://picsum.photos/id/1003/400/250",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: true,
  },
  {
    title: "Outdated news dont read",
    img: "https://picsum.photos/id/1004/400/250",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: false,
  },
];

function NewsCard({ title, desc, badge, img }) {
  return (
    <div class="card card-bordered w-full bg-base-200">
      <Image src={img} effect="blur" className="w-full h-56 object-cover" />
      <div class="card-body flex justify-between p-6">
        <div>
          <h2 class="card-title truncate">
            {badge && <div class="badge badge-primary badge-outline">NEW</div>}{" "}
            {title}
          </h2>
          <p className="text-sm">{desc}</p>
        </div>
        <div class="justify-end card-actions">
          <button class="btn btn-primary">Learn more</button>
        </div>
      </div>
    </div>
  );
}

function News() {
  return (
    <div className="container px-4 mb-12">
      <button className="text-3xl mb-4 underline decoration-primary decoration-4 underline-offset-4">
        Latest news
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestNews.map((news) => (
          <NewsCard
            title={news.title}
            desc={news.description}
            badge={news.featured}
            img={news.img}
          />
        ))}
      </div>
    </div>
  );
}

export default News;