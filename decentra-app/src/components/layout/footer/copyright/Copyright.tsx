import styles from './Copyright.module.scss';

function Copyright() {
  const year = new Date().getFullYear();

    return (
      <small className={styles.copyRight}>
        <span className={styles.rightPart} style={{ color: "black" }}>
        {year} ©️ All rights reserved.
        </span>
      </small>
    );
  }

export { Copyright };
