import React from 'react';
import styles from './Socials.module.scss';

const teamMembers = [
  { name: 'Melvin He', github: 'https://github.com/melvinhe' },
  { name: 'Seong-Heon Jung', github: 'https://github.com/Forthoney' },
  { name: 'Jay Khurana', github: 'https://github.com/jaykk128' },
  { name: 'Peter Li', github: 'https://github.com/lipet2k' },
  { name: 'Eli Silvert', github: 'https://github.com/elisilvert' },
];


function Socials() {
  return (
    <span className={styles.leftPart} style={{ color: 'black' }}>
      {'</>'} with ❤️ by&nbsp;
      {teamMembers.map((member, index) => (
        <React.Fragment key={member.name}>
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bubbleLink}
          >
            {member.name}
            <span className={styles.bubble} />
          </a>
          {index !== teamMembers.length - 1 && ', '}
        </React.Fragment>
      ))}
    </span>
  );
}

export { Socials };
