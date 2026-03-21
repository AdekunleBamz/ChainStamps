import { Shield, Clock, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="hero relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Radial Glow Effect */}
      <div className="hero-glow" aria-hidden="true" />

      <motion.h1 className="hero-title" variants={itemVariants}>
        <span className="gradient-text">ChainStamp</span>
      </motion.h1>

      <motion.p className="hero-subtitle" variants={itemVariants} aria-label="Subtitle: Permanent on-chain verification">
        Permanent on-chain verification for documents, messages, and data
      </motion.p>

      <motion.p className="hero-description" variants={itemVariants} aria-label="Description: Detailed explanation of ChainStamps and Stacks blockchain integration">
        Store SHA-256 hashes, timestamps, and metadata immutably on
        Bitcoin's most secure layer through the Stacks blockchain.
      </motion.p>
      <motion.div className="features" variants={containerVariants}>
        <motion.div className="feature group" variants={itemVariants} aria-label="Feature: Immutable - Data secured by Bitcoin's proof-of-work">
          <div className="feature-icon-wrapper">
            <Shield className="feature-icon" size={40} strokeWidth={1.5} aria-label="Security Shield Icon" />
          </div>
          <h3>Immutable</h3>
          <p>Data secured by Bitcoin's proof-of-work</p>
        </motion.div>

        <motion.div className="feature group" variants={itemVariants}>
          <div className="feature-icon-wrapper">
            <Clock className="feature-icon" size={40} strokeWidth={1.5} aria-label="Timestamp Clock Icon" />
          </div>
          <h3>Timestamped</h3>
          <p>Permanent proof of existence</p>
        </motion.div>

        <motion.div className="feature group" variants={itemVariants}>
          <div className="feature-icon-wrapper">
            <Database className="feature-icon" size={40} strokeWidth={1.5} aria-label="Database Storage Icon" />
          </div>
          <h3>Verifiable</h3>
          <p>Anyone can verify your data</p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
