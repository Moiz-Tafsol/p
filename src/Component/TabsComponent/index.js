import classes from "./TabsComponent.module.css";

function TabsComponent({ data, setter, value, onClick, setFilter }) {
  return (
    <div className={classes._tabsHeading}>
      {data?.map((ele, index) => (
        <div
          className={`${classes._initialTab} ${
            value === ele?.label ? classes._selectedclass : ""
          } `}
          onClick={() => setter(ele)}
          key={index}
        >
          {ele?.icon}
          <p>{ele.label}</p>
        </div>
      ))}
    </div>
  );
}

export default TabsComponent;
