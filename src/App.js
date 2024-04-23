import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import "react-modern-drawer/dist/index.css";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { io } from "socket.io-client";
import { Get } from "./Axios/AxiosFunctions";
import { Loader } from "./Component/Loader";
import BeforeLoginRoute from "./Helper/BeforeLoginRoute";
import ProtectedRoute from "./Helper/ProtectedRoute";
import ScrollToTop from "./Helper/ScrollToTop";
import "./assets/Styles/style.css";
import "./assets/Styles/table.css";
import { BaseURL, apiUrl } from "./config/apiUrl";
import { updateUser } from "./store/auth/authSlice";
import { saveNewNotification } from "./store/common/commonSlice";

const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const ReportDetail = lazy(() => import("./pages/ReportDetail"));
const Support = lazy(() => import("./pages/Support"));
const UserDetail = lazy(() => import("./pages/UserView"));
const UserEdit = lazy(() => import("./pages/UserEdit"));
const Levels = lazy(() => import("./pages/Levels"));
const GalleryDetail = lazy(() => import("./pages/GalleryDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Reports = lazy(() => import("./pages/Reports"));
const Faqs = lazy(() => import("./pages/Faqs"));
const Categories = lazy(() => import("./pages/Categories"));
const Login = lazy(() => import("./pages/Login"));
const Forums = lazy(() => import("./pages/Forums"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogsAddEdit = lazy(() => import("./pages/BlogsAddEdit"));
const Setting = lazy(() => import("./pages/Setting"));
const Notifications = lazy(() => import("./pages/Notification"));
const CmsAbout = lazy(() => import("./pages/Cms/About"));
const CmsContact = lazy(() => import("./pages/Cms/Contact"));
const CmsBlog = lazy(() => import("./pages/Cms/Blogs"));
const CmsHome = lazy(() => import("./pages/Cms/Home"));
const CmsFaqs = lazy(() => import("./pages/Cms/Faq"));
const CmsTerms = lazy(() => import("./pages/Cms/Terms&Conditions"));
const CmsPrivacy = lazy(() => import("./pages/Cms/Privacy"));
const CmsFooter = lazy(() => import("./pages/Cms/Footer"));
const CmsProductDetail = lazy(() => import("./pages/Cms/ProductDetails"));
const CmsBlogDetail = lazy(() => import("./pages/Cms/BlogDetail"));
const CmsForum = lazy(() => import("./pages/Cms/Forum"));
const CmsForumDetail = lazy(() => import("./pages/Cms/ForumDetail"));

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const { access_token } = useSelector((state) => state?.authReducer);
  const { isLogin } = useSelector((state) => state?.authReducer);
  const { newNotifications } = useSelector((state) => state?.commonReducer);
  const { user } = useSelector((state) => state?.authReducer);
  const socket = useRef(null);
  const dispatch = useDispatch();

  // notification
  const getNotificationFromSocket = async () => {
    const responseData = await Get(
      BaseURL("notifications"),
      access_token,
      false,
      dispatch
    );
    if (responseData !== undefined) {
      const unreadNotifications =
        responseData?.data?.data?.notifications?.filter(
          (item) => item?.seen == false
        );
      dispatch(saveNewNotification(unreadNotifications));
    }
    socket.current = io(apiUrl, { transports: ["websocket"] });
    socket.current.emit("join", { id: user?._id });
    socket.current.on("new-notification", ({ notification }) => {
      dispatch(saveNewNotification([...newNotifications, notification]));
    });
  };

  //getUsers
  const getUsers = async () => {
    const response = await Get(BaseURL("users/me"), access_token);
    if (response) {
      dispatch(updateUser(response.data.data));
    }
  };

  useEffect(() => {
    if (isLogin) {
      getNotificationFromSocket();
      getUsers();
    }
    return () => {
      socket.current.off("new-notification");
      socket.current.disconnect();
    };
  }, [isLogin]);

  if (isLoading) {
    return <Loader className="vh-100" />;
  }

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loader className={"vh-100"} />}>
          <Routes>
            <Route
              path="/"
              exact
              // element={<Dashboard />}
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/login"
              exact
              element={<BeforeLoginRoute element={<Login />} />}
            />
            <Route
              path="/users"
              exact
              element={<ProtectedRoute element={<Users />} />}
            />
            <Route
              path="/reports/:slug"
              exact
              element={<ProtectedRoute element={<ReportDetail />} />}
            />
            <Route
              path="/notifications"
              exact
              element={<ProtectedRoute element={<Notifications />} />}
            />
            <Route
              path="/support"
              exact
              element={<ProtectedRoute element={<Support />} />}
            />
            <Route
              path="/user-edit/:id"
              exact
              element={<ProtectedRoute element={<UserEdit />} />}
            />
            <Route
              path="/user-detail/:slug"
              exact
              element={<ProtectedRoute element={<UserDetail />} />}
            />
            <Route
              path="/gallery/:id"
              exact
              element={<ProtectedRoute element={<GalleryDetail />} />}
            />

            <Route
              path="/gallery"
              exact
              element={<ProtectedRoute element={<Gallery />} />}
            />
            <Route
              path="/reports"
              exact
              element={<ProtectedRoute element={<Reports />} />}
            />

            <Route
              path="/levels"
              exact
              element={<ProtectedRoute element={<Levels />} />}
            />
            <Route
              path="/faqs"
              exact
              element={<ProtectedRoute element={<Faqs />} />}
            />
            <Route
              path="/categories"
              exact
              element={<ProtectedRoute element={<Categories />} />}
            />

            <Route
              path="/forums"
              exact
              element={<ProtectedRoute element={<Forums />} />}
            />
            <Route
              path="/blogs"
              exact
              element={<ProtectedRoute element={<Blogs />} />}
            />
            <Route
              path="/blogs/add-edit"
              exact
              element={<ProtectedRoute element={<BlogsAddEdit />} />}
            />

            <Route
              path="/setting"
              exact
              element={<ProtectedRoute element={<Setting />} />}
            />

            <Route
              path="/cms/blogs"
              exact
              element={<ProtectedRoute element={<CmsBlog />} />}
            />

            <Route
              path="/cms/about"
              exact
              element={<ProtectedRoute element={<CmsAbout />} />}
            />

            <Route
              path="/cms/home"
              exact
              element={<ProtectedRoute element={<CmsHome />} />}
            />

            <Route
              path="/cms/contact"
              exact
              element={<ProtectedRoute element={<CmsContact />} />}
            />

            <Route
              path="/cms/faqs"
              exact
              element={<ProtectedRoute element={<CmsFaqs />} />}
            />

            <Route
              path="/cms/terms"
              exact
              element={<ProtectedRoute element={<CmsTerms />} />}
            />
            <Route
              path="/cms/privacy"
              exact
              element={<ProtectedRoute element={<CmsPrivacy />} />}
            />
            <Route
              path="/cms/footer"
              exact
              element={<ProtectedRoute element={<CmsFooter />} />}
            />
            <Route
              path="/cms/blog-detail"
              exact
              element={<ProtectedRoute element={<CmsBlogDetail />} />}
            />
            <Route
              path="/cms/forum"
              exact
              element={<ProtectedRoute element={<CmsForum />} />}
            />
            <Route
              path="/cms/forum-detail"
              exact
              element={<ProtectedRoute element={<CmsForumDetail />} />}
            />
            <Route
              path="/cms/product-detail"
              exact
              element={<ProtectedRoute element={<CmsProductDetail />} />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
