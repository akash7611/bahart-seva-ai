import { useEffect, useState } from "react";
import {
  Search,
  Mic,
  ShieldCheck,
  FileText,
  Grid2X2,
  ArrowRight,
  Leaf,
  Home,
  Umbrella,
  Baby,
  Globe2,
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import "./App.css";

const BACKEND_URL = "http://127.0.0.1:8001";

function App() {
  const [search, setSearch] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [occupation, setOccupation] = useState("");
  const [income, setIncome] = useState("");
  const [age, setAge] = useState("");
  const [eligibilityResults, setEligibilityResults] = useState([]);

  // =========================
  // GET SCHEMES
  // =========================

  const getSchemes = async () => {
    const response = await fetch(`${BACKEND_URL}/schemes`);

    if (!response.ok) {
      throw new Error("Backend error");
    }

    return await response.json();
  };

  // =========================
  // SEARCH
  // =========================

  const findSchemes = async (customSearch = search) => {
    setLoading(true);

    try {
      const data = await getSchemes();

      const query = customSearch.toLowerCase().trim();

      const filtered = query
        ? data.schemes.filter((scheme) =>
            (
              scheme.name +
              " " +
              scheme.category +
              " " +
              scheme.target +
              " " +
              scheme.description
            )
              .toLowerCase()
              .includes(query)
          )
        : data.schemes;

      setSchemes(filtered);

      setTimeout(() => {
        document
          .getElementById("popular-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Backend se connection nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // POPULAR SEARCH
  // =========================

  const popularSearch = (value) => {
    setSearch(value);
    findSchemes(value);
  };

  // =========================
  // EXPLORE
  // =========================

  const openExplore = async () => {
    try {
      const data = await getSchemes();
      setSchemes(data.schemes);
      setModal("explore");
    } catch (error) {
      alert("Schemes load nahi ho rahi.");
    }
  };

  // =========================
  // DOCUMENTS
  // =========================

  const openDocuments = async () => {
    try {
      const data = await getSchemes();
      setSchemes(data.schemes);
      setSelectedScheme(null);
      setModal("documents");
    } catch (error) {
      alert("Documents load nahi ho rahe.");
    }
  };

  // =========================
  // ELIGIBILITY
  // =========================

  const checkEligibility = async () => {
    try {
      const data = await getSchemes();

      const occupationText = occupation.toLowerCase();

      const results = data.schemes.filter((scheme) => {
        const target = scheme.target.toLowerCase();
        const category = scheme.category.toLowerCase();
        const name = scheme.name.toLowerCase();

        if (
          occupationText.includes("farmer") ||
          occupationText.includes("agriculture")
        ) {
          return (
            target.includes("farmer") ||
            category.includes("agriculture")
          );
        }

        if (
          occupationText.includes("parent") ||
          occupationText.includes("girl")
        ) {
          return (
            name.includes("sukanya") ||
            category.includes("savings")
          );
        }

        if (
          occupationText.includes("family") ||
          occupationText.includes("housing")
        ) {
          return (
            category.includes("housing") ||
            target.includes("family")
          );
        }

        if (
          occupationText.includes("bank") ||
          occupationText.includes("employee")
        ) {
          return category.includes("insurance");
        }

        return true;
      });

      setEligibilityResults(results);
    } catch (error) {
      alert("Eligibility check nahi ho paya.");
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setModal(null);
    setSelectedScheme(null);
  };

  // ESC KEY
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="navbar">

        <div className="brand">

          <div className="ashoka">
            ☸
          </div>

          <div>
            <div className="brand-name">
              BharatSeva <span>AI</span>
            </div>

            <div className="brand-tagline">
              Sarkari Yojana • Sabke Liye • Aasaan
            </div>
          </div>

        </div>

        <nav className="nav-links">

          <button className="nav-active">
            <Home size={17} />
            Home
          </button>

          <button onClick={openExplore}>
            <Grid2X2 size={17} />
            Schemes
          </button>

          <button
            onClick={() => {
              setEligibilityResults([]);
              setModal("eligibility");
            }}
          >
            <ShieldCheck size={17} />
            Eligibility
          </button>

          <button onClick={openDocuments}>
            <FileText size={17} />
            Documents
          </button>

        </nav>

        <div className="nav-right">

          <button className="language">
            <Globe2 size={17} />
            English
            <span>⌄</span>
          </button>

          <div className="digital-india">
            <div className="di-logo">◉</div>
            <div>
              <strong>Digital India</strong>
              <small>Power To The People</small>
            </div>
          </div>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-content">

          <div className="ai-badge">
            <Sparkles size={16} />
            AI-Powered Government Services
          </div>

          <h1>
            Government Schemes,
            <br />
            <span>Made Simple.</span>
          </h1>

          <p className="hero-text">
            Find government schemes, check eligibility and discover
            required documents — all in one place.
          </p>

          {/* SEARCH */}

          <div className="big-search">

            <Search size={25} />

            <input
              type="text"
              placeholder="Try: farmer, housing, insurance, education..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  findSchemes();
                }
              }}
            />

            <button className="voice-button">
              <Mic size={21} />
            </button>

            <button
              className="find-button"
              onClick={() => findSchemes()}
            >
              {loading ? "Searching..." : "Find Schemes"}
              <ArrowRight size={19} />
            </button>

          </div>

          {/* POPULAR SEARCHES */}

          <div className="popular-searches">

            <strong>
              <Sparkles size={14} />
              Popular searches:
            </strong>

            <button onClick={() => popularSearch("farmer")}>
              Farmer
            </button>

            <button onClick={() => popularSearch("housing")}>
              Housing
            </button>

            <button onClick={() => popularSearch("insurance")}>
              Insurance
            </button>

            <button onClick={() => popularSearch("education")}>
              Education
            </button>

            <button onClick={() => popularSearch("girl child")}>
              Girl Child
            </button>

            <button onClick={() => popularSearch("pension")}>
              Pension
            </button>

          </div>

        </div>

        {/* HERO VISUAL */}

        <div className="hero-visual">

          <div className="india-orb">
            🇮🇳
          </div>

          <div className="citizen citizen-one">
            👨🏽‍🌾
          </div>

          <div className="citizen citizen-two">
            👩🏽‍🎓
          </div>

          <div className="citizen citizen-three">
            👨🏽‍💼
          </div>

          <div className="citizen citizen-four">
            👩🏽
          </div>

          <div className="tricolor-wave"></div>

          <div className="hero-stamp">
            <strong>हर नागरिक</strong>
            <span>का अधिकार</span>
            <div></div>
          </div>

        </div>

      </section>


      {/* ================= FEATURE CARDS ================= */}

      <section className="features">

        {/* ELIGIBILITY */}

        <button
          className="feature-card green-card"
          onClick={() => {
            setEligibilityResults([]);
            setModal("eligibility");
          }}
        >

          <div className="feature-icon green-icon">
            <ShieldCheck size={29} />
          </div>

          <div className="feature-info">

            <h3>Check Eligibility</h3>

            <p>
              Answer a few questions and discover
              relevant schemes.
            </p>

            <span className="feature-tag green-tag">
              Quick • Easy • Accurate
            </span>

          </div>

          <div className="card-arrow">
            <ArrowRight size={19} />
          </div>

        </button>


        {/* DOCUMENTS */}

        <button
          className="feature-card blue-card"
          onClick={openDocuments}
        >

          <div className="feature-icon blue-icon">
            <FileText size={29} />
          </div>

          <div className="feature-info">

            <h3>Check Documents</h3>

            <p>
              See documents required for different
              schemes.
            </p>

            <span className="feature-tag blue-tag">
              Know Before You Apply
            </span>

          </div>

          <div className="card-arrow blue-arrow">
            <ArrowRight size={19} />
          </div>

        </button>


        {/* EXPLORE */}

        <button
          className="feature-card purple-card"
          onClick={openExplore}
        >

          <div className="feature-icon purple-icon">
            <Search size={29} />
          </div>

          <div className="feature-info">

            <h3>Explore Schemes</h3>

            <p>
              Browse all available government
              schemes.
            </p>

            <span className="feature-tag purple-tag">
              Discover More
            </span>

          </div>

          <div className="card-arrow purple-arrow">
            <ArrowRight size={19} />
          </div>

        </button>

      </section>


      {/* ================= SCHEMES ================= */}

      <section
        className="popular-section"
        id="popular-section"
      >

        <div className="section-heading">

          <div>

            <div className="section-title">
              <span>🔥</span>
              <h2>Popular Schemes</h2>
            </div>

            <p>
              Top government schemes helping millions of Indians
            </p>

          </div>

          <button
            className="view-all"
            onClick={openExplore}
          >
            View All Schemes
            <ArrowRight size={17} />
          </button>

        </div>


        <div className="scheme-grid">

          {schemes.length > 0
            ? schemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                />
              ))
            : (
              <>
                <DemoScheme
                  icon={<Leaf size={19} />}
                  title="PM-KISAN Samman Nidhi"
                  description="Financial support to eligible farmer families."
                  category="Agriculture"
                  type="green"
                />

                <DemoScheme
                  icon={<Home size={19} />}
                  title="Pradhan Mantri Awas Yojana"
                  description="Affordable housing support for eligible families."
                  category="Housing"
                  type="orange"
                />

                <DemoScheme
                  icon={<Umbrella size={19} />}
                  title="PM Suraksha Bima Yojana"
                  description="Low-cost accident insurance for eligible citizens."
                  category="Insurance"
                  type="blue"
                />

                <DemoScheme
                  icon={<Baby size={19} />}
                  title="Sukanya Samriddhi Yojana"
                  description="Savings scheme for the future of a girl child."
                  category="Savings"
                  type="pink"
                />
              </>
            )}

        </div>

      </section>


      {/* ================= MODALS ================= */}

      {modal && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div
            className="modal-box"
            onMouseDown={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={closeModal}
            >
              <X size={22} />
            </button>


            {/* ELIGIBILITY */}

            {modal === "eligibility" && (

              <>
                <div className="modal-top-icon green-icon">
                  <ShieldCheck size={28} />
                </div>

                <h2>Check Your Eligibility</h2>

                <p>
                  Tell us about yourself and discover
                  potentially relevant government schemes.
                </p>

                <label>Occupation / Profile</label>

                <input
                  placeholder="Farmer, Student, Parent..."
                  value={occupation}
                  onChange={(e) =>
                    setOccupation(e.target.value)
                  }
                />

                <label>Annual Income</label>

                <input
                  type="number"
                  placeholder="Example: 200000"
                  value={income}
                  onChange={(e) =>
                    setIncome(e.target.value)
                  }
                />

                <label>Age</label>

                <input
                  type="number"
                  placeholder="Example: 35"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value)
                  }
                />

                <button
                  className="modal-action"
                  onClick={checkEligibility}
                >
                  Check My Eligibility
                  <ArrowRight size={18} />
                </button>

                {eligibilityResults.length > 0 && (

                  <div className="eligibility-results">

                    <h3>
                      <CheckCircle2 size={20} />
                      Potentially Relevant Schemes
                    </h3>

                    {eligibilityResults.map((scheme) => (

                      <div
                        className="eligibility-result"
                        key={scheme.id}
                      >

                        <strong>{scheme.name}</strong>

                        <p>{scheme.description}</p>

                        <small>
                          Documents:{" "}
                          {scheme.documents.join(", ")}
                        </small>

                      </div>

                    ))}

                  </div>

                )}

              </>

            )}


            {/* DOCUMENTS */}

            {modal === "documents" && (

              <>
                <div className="modal-top-icon blue-icon">
                  <FileText size={28} />
                </div>

                <h2>Check Documents</h2>

                <p>
                  Select a government scheme to see
                  commonly required documents.
                </p>

                <div className="document-options">

                  {schemes.map((scheme) => (

                    <button
                      key={scheme.id}
                      onClick={() =>
                        setSelectedScheme(scheme)
                      }
                    >

                      <div>
                        <strong>{scheme.name}</strong>
                        <small>{scheme.category}</small>
                      </div>

                      <ArrowRight size={18} />

                    </button>

                  ))}

                </div>

                {selectedScheme && (

                  <div className="selected-documents">

                    <h3>
                      📄 Required Documents
                    </h3>

                    <h4>
                      {selectedScheme.name}
                    </h4>

                    {selectedScheme.documents.map(
                      (doc, index) => (

                        <div
                          className="document-row"
                          key={index}
                        >
                          <CheckCircle2 size={17} />
                          {doc}
                        </div>

                      )
                    )}

                    <a
                      href={selectedScheme.official_source}
                      target="_blank"
                      rel="noreferrer"
                      className="official-link"
                    >
                      Official Source
                      <ExternalLink size={16} />
                    </a>

                  </div>

                )}

              </>

            )}


            {/* EXPLORE */}

            {modal === "explore" && (

              <>
                <div className="modal-top-icon purple-icon">
                  <Grid2X2 size={28} />
                </div>

                <h2>Explore Government Schemes</h2>

                <p>
                  Discover schemes available through
                  BharatSeva AI.
                </p>

                <div className="explore-modal-list">

                  {schemes.map((scheme) => (

                    <div
                      className="explore-modal-item"
                      key={scheme.id}
                    >

                      <div>

                        <h3>{scheme.name}</h3>

                        <span>
                          {scheme.category}
                        </span>

                        <p>
                          {scheme.description}
                        </p>

                      </div>

                      <a
                        href={scheme.official_source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                        <ArrowRight size={16} />
                      </a>

                    </div>

                  ))}

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


// =========================
// DEMO SCHEME CARD
// =========================

function DemoScheme({
  icon,
  title,
  description,
  category,
  type,
}) {
  return (
    <div className={`scheme-card ${type}`}>

      <div className="scheme-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="scheme-category">
        {category}
      </span>

      <div className="scheme-bottom">
        <span>View Details</span>
        <ArrowRight size={17} />
      </div>

    </div>
  );
}


// =========================
// REAL SCHEME CARD
// =========================

function SchemeCard({ scheme }) {

  return (
    <div className="scheme-card real-card">

      <div className="scheme-icon">
        <ShieldCheck size={19} />
      </div>

      <h3>{scheme.name}</h3>

      <p>{scheme.description}</p>

      <span className="scheme-category">
        {scheme.category}
      </span>

      <a
        href={scheme.official_source}
        target="_blank"
        rel="noreferrer"
        className="scheme-bottom"
      >
        <span>View Details</span>
        <ArrowRight size={17} />
      </a>

    </div>
  );
}

export default App;