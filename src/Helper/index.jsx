import defaultImage from "../assets/images/default/default.jpg";

export const handleImageError = (e) => {
  e.target.srcset = "";
  console.log("error img", e.target.src);
  e.target.src = defaultImage;
};
