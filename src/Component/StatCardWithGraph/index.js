import classes from "./StatCardWithGraph.module.css";

export default function StatCardWithGraph({ item, icon }) {
  return (
    item && (
      <div className={classes.statCard}>
        <div className={classes.__header}>
          <h4 className={classes.__title}>{item?.header}</h4>
          <p className={classes.__amount}>{item?.amount}</p>
        </div>
        <div className={classes.icondiv}>
          <span className={classes.icon}>{icon}</span>
        </div>
      </div>
    )
  );
}
