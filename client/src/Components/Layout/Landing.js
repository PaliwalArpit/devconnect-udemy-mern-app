import React from 'react'
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
             <section className="landing">
      <div className="dark-overlay">
        <div class="landing-inner">
          <h1 class="x-large">Developer Connector</h1>
          <p class="lead">
            Create developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn">Login</Link>
          </div>
        </div>
      </div>
    </section>
        </div>
    )
}
export default Landing;