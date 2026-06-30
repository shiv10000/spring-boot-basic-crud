import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const emptyForm = {
  postProfile: "",
  postDesc: "",
  reqExperiance: "",
  postTechStack: "",
};

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7m4 0H5a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm2 5.3a21.8 21.8 0 0 1-18 0M9.5 12v1.5m5-1.5v1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16m-10 4v6m4-6v6M9 7l1-3h4l1 3m3 0-1 13H7L6 7" />
    </svg>
  );
}

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const nextId = useMemo(
    () => Math.max(0, ...jobs.map((job) => Number(job.postId) || 0)) + 1,
    [jobs],
  );

  async function loadJobs() {
    try {
      setError("");
      const response = await fetch(`${API_BASE}/jobPosts`);
      if (!response.ok) throw new Error("Could not load jobs.");
      setJobs(await response.json());
    } catch (requestError) {
      setError(
        `${requestError.message} Make sure the Spring Boot server is running on port 8080.`,
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function addJob(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");

    const newJob = {
      postId: nextId,
      postProfile: form.postProfile.trim(),
      postDesc: form.postDesc.trim(),
      reqExperiance: Number(form.reqExperiance),
      postTechStack: form.postTechStack
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(`${API_BASE}/getJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      if (!response.ok) throw new Error("The job could not be added.");

      setForm(emptyForm);
      setNotice("Job published successfully.");
      await loadJobs();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteJob(id) {
    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_BASE}/getJob/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("The job could not be deleted.");

      setJobs((current) => current.filter((job) => job.postId !== id));
      setNotice("Job deleted.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Jobly home">
          <span className="brand-mark"><BriefcaseIcon /></span>
          Jobly
        </a>
        <a className="header-link" href="#add-job">Post a job</a>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
        <h1>Work that feels<br /><em>worth it.</em></h1>
        <p>
          Browse thoughtfully selected opportunities, or share a role with
          people ready to do their best work.
        </p>
        <a className="primary-button" href="#open-roles">
          Explore open roles <span>↓</span>
        </a>
      </section>

      <section className="jobs-section" id="open-roles">
        <div className="section-heading">
          <div>
            <span className="section-kicker">OPPORTUNITIES</span>
            <h2>Open roles</h2>
          </div>
          <span className="job-count">{jobs.length} {jobs.length === 1 ? "position" : "positions"}</span>
        </div>

        {error && <div className="message error" role="alert">{error}</div>}
        {notice && <div className="message success" role="status">{notice}</div>}

        {loading ? (
          <div className="empty-state">Gathering open roles…</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No roles posted yet.</h3>
            <p>Be the first to add an opportunity below.</p>
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map((job, index) => (
              <article className="job-card" key={job.postId}>
                <div className="card-top">
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteJob(job.postId)}
                    disabled={deletingId === job.postId}
                    aria-label={`Delete ${job.postProfile}`}
                  >
                    <TrashIcon />
                    {deletingId === job.postId ? "Deleting…" : "Delete"}
                  </button>
                </div>
                <h3>{job.postProfile}</h3>
                <p className="description">{job.postDesc}</p>
                <div className="experience">
                  <span>EXPERIENCE</span>
                  <strong>{job.reqExperiance} {job.reqExperiance === 1 ? "year" : "years"}</strong>
                </div>
                <div className="tags">
                  {job.postTechStack?.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="add-section" id="add-job">
        <div className="form-intro">
          <span className="section-kicker">GROW THE TEAM</span>
          <h2>Post a new<br /><em>opportunity.</em></h2>
          <p>Share the role, the craft, and the experience you’re looking for.</p>
        </div>

        <form onSubmit={addJob}>
          <label>
            Job title
            <input
              name="postProfile"
              value={form.postProfile}
              onChange={updateField}
              placeholder="e.g. Product Designer"
              required
            />
          </label>

          <label>
            Job description
            <textarea
              name="postDesc"
              value={form.postDesc}
              onChange={updateField}
              placeholder="Tell candidates what makes this role meaningful…"
              rows="5"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Experience (years)
              <input
                name="reqExperiance"
                type="number"
                min="0"
                max="50"
                value={form.reqExperiance}
                onChange={updateField}
                placeholder="3"
                required
              />
            </label>
            <label>
              Skills
              <input
                name="postTechStack"
                value={form.postTechStack}
                onChange={updateField}
                placeholder="React, CSS, Figma"
                required
              />
              <small>Separate skills with commas</small>
            </label>
          </div>

          <button className="submit-button" type="submit" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish job"}
            <span>→</span>
          </button>
        </form>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark"><BriefcaseIcon /></span>
          Jobly
        </a>
        <p>Good work starts with a good opportunity.</p>
      </footer>
    </main>
  );
}

export default App;
