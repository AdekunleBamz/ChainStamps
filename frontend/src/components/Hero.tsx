import { Shield, Clock, Database } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">
        <span className="gradient-text">ChainStamp</span>
      </h1>
      <p className="hero-subtitle">
        Permanent on-chain verification for documents, messages, and data
      </p>
      <p className="hero-description">
        Store SHA-256 hashes, timestamps, and metadata immutably on 
        Bitcoin's most secure layer through the Stacks blockchain.
      </p>
      
      <div className="features">
        <div className="feature">
          <Shield className="feature-icon" />
          <h3>Immutable</h3>
          <p>Data secured by Bitcoin's proof-of-work</p>
        </div>
        <div className="feature">
          <Clock className="feature-icon" />
          <h3>Timestamped</h3>
          <p>Permanent proof of existence</p>
        </div>
        <div className="feature">
          <Database className="feature-icon" />
          <h3>Verifiable</h3>
          <p>Anyone can verify your data</p>
        </div>
      </div>
    </section>
  );
}
