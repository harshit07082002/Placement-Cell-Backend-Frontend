import React from "react";
import { Card } from 'react-bootstrap';
import classes from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <Card className={classes.container}>
      <h1>About Us</h1>
      <hr />
      <p style={{marginTop:'1.5rem'}}>
      Welcome to CareerCrest – your gateway to a world of opportunities and possibilities!
At CareerCrest, we understand that the transition from academia to the professional world is a pivotal moment in a student's journey. That's why we've crafted a comprehensive campus placement app that bridges the gap between aspiring students and prospective employers. Our platform serves as a dynamic hub where students can explore, apply, and secure their dream jobs while offering administrators the tools they need to effortlessly manage and curate job listings.
      </p>
      <p>
      <b>For Students:</b> <br />
Embark on your professional odyssey with CareerCrest's user-friendly interface designed to simplify the job application process. Discover an extensive array of job listings from top-notch companies, spanning various industries and sectors. Our app empowers you to showcase your skills, qualifications, and achievements through a personalized profile, giving you a competitive edge in the job market. Seamlessly navigate through job descriptions, requirements, and company profiles to make informed decisions about your career path. With just a few taps, you can apply to multiple jobs and monitor your application status, ensuring you never miss out on an opportunity that aligns with your aspirations.
      </p>
      <p>
      <b>For Administrators:</b> <br />
Simplify the complexities of campus placement with CareerCrest's intuitive admin panel. As an administrator, you hold the reins to shape the job landscape for students. Effortlessly add new job listings, complete with comprehensive details, to attract the best talent to your organization. Customize application criteria, deadlines, and eligibility requirements to ensure a seamless match between students and job openings. Our platform equips you with real-time analytics and insights, enabling you to monitor application volumes, engagement rates, and other key metrics. Stay in control of the placement process, streamline communication with both students and employers, and drive successful placements like never before.
      </p>
    </Card>
  );
};

export default AboutPage;