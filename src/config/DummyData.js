import { userAvatar } from "../constant/imagePath";
import cardImage from "../assets/images/apple.png";
import userImg from "../assets/images/userImage.png";
import { FaEarthAfrica, FaFacebook, FaInstagram } from "react-icons/fa6";
import { BsTwitter, BsYoutube } from "react-icons/bs";

export const userArr = Array(10).fill({
  id: "1",
  name: "Jhone Doe",
  email: "johndoe@email.com",
  phone: "1234567890",
  status: "Active",
});
export const reportsArr = Array(10).fill({
  id: "1",
  name: "Jhone Doe",
  email: "johndoe@email.com",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
});
export const supportArr = Array(10).fill({
  id: "1",
  name: "Jhone Doe",
  email: "johndoe@email.com",
  subject: "johndoe@email.com",
  message:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
});

export const imagesCardsList = [
  {
    id: 1,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 2,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 3,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 4,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 5,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 6,
    flagValue: 17,
    image: cardImage,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 7,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
  {
    id: 8,
    image: cardImage,
    flagValue: 17,
    status: "Pending",
    userImage: userImg,
    userName: "Carsten Kohler",
  },
];
export const levelsArr = [
  {
    id: "1",
    title: "Bronze",
    downloads: "30",
    limit: "10",
  },
  {
    id: "2",
    title: "Silver",
    downloads: "30",
    limit: "10",
  },
  {
    id: "3",
    title: "Gold",
    downloads: "30",
    limit: "10",
  },
  {
    id: "4",
    title: "Platinum",
    downloads: "30",
    limit: "10",
  },
  {
    id: "5",
    title: "Diamond",
    downloads: "30",
    limit: "10",
  },
];
export const ViewwEditUserArr = [
  {
    profile: userAvatar,
    firstName: "Dotenet Develepr",
    LastName: "Best Develeper",
    email: "xyz@gmail.com",
    country: "Some Country",
    city: "SomeCity",
    about:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged.",
    donations: "lorem loem lreoe",
    socials: [
      {
        label: "Facebook",
        icon: <FaFacebook size={24} />,
        link: "",
      },
      {
        label: "Instagram",
        icon: <FaInstagram size={24} />,
        link: "",
      },
      {
        label: "Twitter",
        icon: <BsTwitter size={24} />,
        link: "",
      },
      {
        label: "Youtube",
        icon: <BsYoutube size={24} />,
        link: "",
      },
      {
        label: "Website",
        icon: <FaEarthAfrica size={24} />,
        link: "",
      },
    ],
    paypal: "paypal@gmail.com",
  },
];

export const topArtists = [
  {
    id: 1,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 2,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 3,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 4,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 5,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 6,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 7,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 8,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
  {
    id: 9,
    image: userImg,
    name: "John Doe",
    followers: "1,778",
    likes: "130K",
    views: "9.95M",
    downloads: "8.4",
  },
];
