import Ratings from "react-star-ratings";

export function StarRating({
  numberOfStars = 5,
  rating,
  starDimension = "15px",
  starEmptyColor,
  starSpacing = "1px",
  type,
  setter,
}) {
  const changeRating = (newRating, name) => {
    setter(newRating);
  };
  return (
    <>
      <Ratings
        numberOfStars={numberOfStars}
        rating={rating || 0}
        starDimension={starDimension}
        starRatedColor={"var(--star-color)"}
        starSpacing={starSpacing}
        changeRating={type === "submit" && changeRating}
        starSelectingHoverColor={starEmptyColor || "blue"}
        svgIconPath={
          "M8.02344 1.01074L9.67383 4.3877L13.3047 4.9209C13.6094 4.97168 13.8633 5.1748 13.9648 5.47949C14.0664 5.75879 13.9902 6.08887 13.7617 6.29199L11.1211 8.90723L11.7559 12.6143C11.8066 12.9189 11.6797 13.2236 11.4258 13.4014C11.1719 13.6045 10.8418 13.6045 10.5625 13.4775L7.3125 11.7256L4.03711 13.4775C3.7832 13.6045 3.45312 13.6045 3.19922 13.4014C2.94531 13.2236 2.81836 12.9189 2.86914 12.6143L3.47852 8.90723L0.837891 6.29199C0.634766 6.08887 0.558594 5.75879 0.634766 5.47949C0.736328 5.1748 0.990234 4.97168 1.29492 4.9209L4.95117 4.3877L6.57617 1.01074C6.70312 0.731445 6.98242 0.553711 7.3125 0.553711C7.61719 0.553711 7.89648 0.731445 8.02344 1.01074Z"
        }
        svgIconViewBox={"0 0 15 14"}
      />
    </>
  );
}
