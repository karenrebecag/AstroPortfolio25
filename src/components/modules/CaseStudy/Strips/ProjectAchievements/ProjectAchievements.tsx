'use client';
import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProjectAchievements.module.css';

export interface Achievement {
  title: string;
  description: string;
}

export interface Props {
  title: string;
  achievements: Achievement[];
  imageSrc: string;
}

export const ProjectAchievements: React.FC<Props> = ({ title, achievements, imageSrc }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Open the first item by default

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.section 
            className={styles.achievementsSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <h2 className={styles.mainTitle}>{title}</h2>
            <div className={styles.container}>
                <div className={styles.leftColumn}>
                    {achievements.slice(0, 4).map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.accordionItem} ${openIndex === index ? styles.accordionItemOpen : ''}`}
                            onClick={() => toggleItem(index)}
                        >
                            <div className={styles.accordionHeader}>
                                <span className={styles.accordionTitle}>{item.title}</span>
                                <div className={`${styles.icon} ${openIndex === index ? styles.iconOpen : ''}`}>
                                    <div className={styles.iconLine}></div>
                                </div>
                            </div>
                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                        animate={{ height: 'auto', opacity: 1, marginTop: '20px' }}
                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        className={styles.accordionContent}
                                    >
                                        <p className={styles.accordionDescription}>{item.description}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
                <div className={styles.rightColumn}>
                    <img src={imageSrc} alt="Project Achievement" />
                </div>
            </div>
        </motion.section>
    );
};
