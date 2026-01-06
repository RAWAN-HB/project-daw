import React from "react";
import { Link } from "react-router-dom"; // ✅ Needed for <Link>
import "./myevent.css";
import campus from "../images/lab.jpg (2)d.jpg";
import lab from "../images/lab.jpg.jpg";
import tech from "../images/tech.jpg.jpg";
import myevent from "../images/myevent.jpg";

function MyEvent() {
  return (
    <div className="myevent-page">

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="left">
          <h2>Science & Tech Events</h2>
          <h3>in Université Constantine 2</h3>
          <p>
            Discover the latest breakthroughs in science, technology, innovation, 
            and research. Join workshops, seminars, and networking sessions.
          </p>
          <div>
            <Link to="/signup">
              <button className="hero-btn">Join Now</button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div
          className="right"
          style={{ backgroundImage: `url(${myevent})` }}
        ></div>
      </div>

      {/* DESCRIPTION CARD */}
      <div className="event-card">
        <h3>📌 Event Description</h3>

        <p>
          The platform for managing scientific things at <strong>Université Constantine 2</strong> is kind of 
          made to handle… well, almost everything related to events, but not always in the same order. 
          Sometimes it starts with submissions, other times participants register first, or maybe the 
          organizers set up the committees before anything else. 🎓 It covers congresses, workshops, 
          seminars, and a lot of stuff that gets mixed depending on who’s using it.
        </p>

        <p>
          These scientific events are basically places where people — researchers, students, teachers, 
          professionals — all gather to talk, share, maybe present something, maybe just listen. 
          It depends. They come from everywhere: <strong>AI, health sciences, robotics, biotech, cybersecurity</strong>, 
          or whatever field fits. 🧪🤖💻 Sometimes it's super structured, sometimes it's more like everyone 
          just trying to understand what’s happening next.
        </p>

        <p>✨ <strong>What the platform somehow includes (not always in this order):</strong></p>

        <ul>
          <li>
            📝 <strong>Before the event?</strong> You can create an event, or maybe edit it later, 
            or maybe the committee isn't added yet — things move around. CFPs might be launched before 
            everything is finalized. Participants register while reviews are still pending. Roles get mixed.
          </li>

          <li>
            📄 <strong>Submissions & evaluations</strong> happen at different speeds. Some proposals 
            get evaluated fast, others wait. Abstracts, keywords, posters, whatever type — they all go 
            somewhere in the system. Reviewers score things but sometimes the reports come later or earlier.
          </li>

          <li>
            🎤 <strong>During the event</strong>, the program exists, but sessions change rooms, workshops 
            may overlap, keynotes are sometimes moved. Q&A works… unless the network lags. Polls appear 
            randomly. Notifications pop up even when nothing has changed.
          </li>

          <li>
            📊 <strong>Afterward</strong>, certificates are generated — sometimes instantly, sometimes 
            after a refresh. Stats come in, some are detailed, others confusing. Everything gets archived 
            somewhere for future events that may or may not use the same structure.
          </li>
        </ul>

        <p>
          🌟 <strong>Why join?</strong> Well, participants usually find something interesting—research, 
          networking, unexpected workshops, or just meeting people from random institutions. It’s all about 
          discovering things and sometimes figuring out how the program fits together.
        </p>

        <p>
          📍 <strong>Event Details (at least these don’t change… usually):</strong><br />
          Venue: Université Constantine 2 — Faculté NTIC<br />
          Date: March 22, 2025<br />
          Time: 09:00 — 17:30<br />
          Organized by: UC2 — Innovation & Research Department
        </p>

        <p>
          ✅ Overall, the platform tries to keep everything clear, even when things shift around. 
          It offers management, transparency, and access — although users sometimes need to navigate 
          through all the features to figure out where everything is happening.
        </p>
      </div>

      {/* IMAGE GALLERY */}
      <div className="event-gallery">
        <img src={campus} alt="Campus UC2" />
        <img src={lab} alt="Laboratory" />
        <img src={tech} alt="Technology" />
      </div>

      {/* INFO BOXES */}
      <div className="event-info">
        <div className="info-box">
          <h4>📍 Location</h4>
          <p>Université Constantine 2 — Faculté NTIC</p>
        </div>
        <div className="info-box">
          <h4>📅 Date</h4>
          <p>March 22, 2025</p>
        </div>
        <div className="info-box">
          <h4>⏰ Time</h4>
          <p>09:00 — 17:30</p>
        </div>
        <div className="info-box">
          <h4>👥 Organized by</h4>
          <p>Innovation & Research Department</p>
        </div>
      </div>

    </div>
  );
}

export default MyEvent;
