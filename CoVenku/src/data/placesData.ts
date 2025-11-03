// /src/data/placesData.ts
import { Place } from "@/types/place";

const testPlaces: Place[] = [
  {
    id: 1,
    name: "Karlštejn Castle",
    imageUrl: "https://r-xx.bstatic.com/xdata/images/xphoto/max1200/119231794.jpg?k=d14f0e0ff058b0955616342a9e57161eb995f533ddd7adbfdecb4061155d0744&o=",
    visitors: 12034,
    description: "A historic castle located in the Czech Republic.",
    
  },
  {
    id: 2,
    name: "Prague Castle",
    imageUrl: "https://r-xx.bstatic.com/xdata/images/xphoto/max1200/119231794.jpg?k=d14f0e0ff058b0955616342a9e57161eb995f533ddd7adbfdecb4061155d0744&o=",
    visitors: 45123,
    description: "The largest ancient castle in the world, located in Prague.", 
  },
  {
    id: 3,
    name: "Český Krumlov",
    imageUrl: "https://r-xx.bstatic.com/xdata/images/xphoto/max1200/119231794.jpg?k=d14f0e0ff058b0955616342a9e57161eb995f533ddd7adbfdecb4061155d0744&o=",
    visitors: 23980,
    description: "A picturesque town in the South Bohemian Region of the Czech Republic.",
  },
];

export default testPlaces;