import React from "react";
import "./Quotimag.css";
import Footer from "../../components/custom/Footer";
const ImageGallery = () => {
  const images = [
    { img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF3OJvkQSqmMhU8-THiPqCagT-aLHLzkw34w&s", img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrZeG_qPulIWE4mBa8eqkhHxGLUBkrdM-Xtg&s" },
    {img1:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRygWtQxNCF270hLxj5UyzkfBCZ1LZm-CRzQ&s", img2:"https://i.pinimg.com/736x/87/68/6d/87686d204e0e70cdf4c87d83ab0752c3.jpg"},
    {img1:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUosfZEIn9GSG2LojgqwjqDAQ_PD-cvLX5-Q&s", img2:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSen-o-U9P3dfudSJQgdx5hrJ3cKv8CLt1bg&s"},
    {img1:"https://motivatedtravellers.com/wp-content/uploads/2022/01/Life-is-short-and-the-world-is-wide-576x1024.jpg", img2:"https://www.boboandchichi.com/wp-content/uploads/Howard-Thurman-Travel-Quotes.jpg"},
    {img1:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF3OJvkQSqmMhU8-THiPqCagT-aLHLzkw34w&s", img2:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRujFUbKUigrmhCtotdK5kSj18MYQdIKLE8k-hN-h2W8woG19uMwK4ReEBxZJFcalrXGng&usqp=CAU"},
    {img1:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUosfZEIn9GSG2LojgqwjqDAQ_PD-cvLX5-Q&s", img2:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgHZ0usS87Hk4rYCXXvivJh4BkS-KXF_TH6w&s"},
    {img1:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSxnKSixbx1JAXi_doPDqYBjUxNG10vCpGAA&s", img2:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQCst25Y3appwpSKfLHXMgp6dXj7Kjs2rACw&s"},
  ];
  return (
    <div>
    <div className="gallery-container">
      {images.map((pair, index) => (
        <div className="image-wrapper" key={index}>
          <img src={pair.img1} alt={`Image 1 - ${index}`} className="image image-1" />
          <img src={pair.img2} alt={`Image 2 - ${index}`} className="image image-2" />
        </div>
      ))}</div>
    <Footer/>
    </div>
  );
};
export default ImageGallery;
