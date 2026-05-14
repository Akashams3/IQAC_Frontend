import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AcademicYearSemesterFilter from "../components/AcademicYearSemesterFilter";
import Modal from "../components/Modal";
import { StatusBadge, Btn, Input, Select, Card, PageHeader, Table, Spinner, Alert } from "../components/UI";
import * as api from "../api/endpoints";
import { academicYearsMatch } from "../utils/academicYear";

const ROLE = "FACULTY";

function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const run = useCallback(async (...args) => {
    setLoading(true); setError(null);
    try { const res = await fn(...args); setData(res.data); return res.data; }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  }, deps);
  return { data, loading, error, run, setData };
}

// ── Profile ──────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState(null);
  const [changePasswordForm, setChangePasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    api.getMyFacultyProfile().then(r => { setProfile(r.data); setForm(r.data); }).catch(() => {});
  }, []);

  const save = async () => {
    try {
      const r = await api.updateMyFacultyProfile(form);
      setProfile(r.data); setEditing(false); setMsg({ type: "success", text: "Profile updated!" });
    } catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.changePassword({ currentPassword: changePasswordForm.oldPassword, newPassword: changePasswordForm.newPassword });
      setShowChangePassword(false);
      setChangePasswordForm({ oldPassword: "", newPassword: "" });
      setMsg({ type: "success", text: "Password changed!" });
    } catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  if (!profile) return <Spinner />;
  return (
    <div>
      <PageHeader title="My Profile" action={
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setShowChangePassword(true)}>Change Password</Btn>
          <Btn onClick={() => setEditing(true)}>Edit Profile</Btn>
        </div>
      } />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", maxWidth: 480 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[["Name", "facultyName"], ["Email", "email"], ["Designation", "designation"]].map(([label, key]) => (
            <div key={key} style={{ display: "flex", gap: 12 }}>
              <span style={{ width: 120, color: "#6b7280", fontSize: 14 }}>{label}</span>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{profile[key] || "—"}</span>
            </div>
          ))}
        </div>
      </div>
      {editing && (
        <Modal title="Edit Profile" onClose={() => setEditing(false)}>
          <Input label="Name" value={form.facultyName || ""} onChange={e => setForm({ ...form, facultyName: e.target.value })} />
          <Input label="Designation" value={form.designation || ""} onChange={e => setForm({ ...form, designation: e.target.value })} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setEditing(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
      {showChangePassword && (
        <Modal title="Change Password" onClose={() => setShowChangePassword(false)}>
          <Input label="Current Password" type="password" value={changePasswordForm.oldPassword} onChange={e => setChangePasswordForm({ ...changePasswordForm, oldPassword: e.target.value })} />
          <Input label="New Password" type="password" value={changePasswordForm.newPassword} onChange={e => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setShowChangePassword(false)}>Cancel</Btn>
            <Btn onClick={handleChangePassword}>Change Password</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Lesson Plans ──────────────────────────────────────────────────────────────
function LessonPlansSection() {
  const [plansRaw, setPlansRaw] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ subject: "", unitName: "", topic: "", plannedHours: "", completedHours: "", academicYear: "", semester: "" });

  const load = () => api.getMyLessonPlans().then(r => setPlansRaw(r.data?.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const plans = useMemo(() => {
    let p = plansRaw;
    if (filterYear) p = p.filter((x) => academicYearsMatch(filterYear, x.academicYear));
    if (filterSem) {
      const s = filterSem.toUpperCase();
      p = p.filter((x) => (x.semester || "").toUpperCase() === s);
    }
    return p;
  }, [plansRaw, filterYear, filterSem]);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    try {
      if (editItem) await api.updateLessonPlan(editItem.id, form);
      else await api.createLessonPlan(form);
      setMsg({ type: "success", text: editItem ? "Updated!" : "Created!" });
      setShowForm(false); setEditItem(null); 
      setForm({ subject: "", unitName: "", topic: "", plannedHours: "", completedHours: "", academicYear: "", semester: "" });
      load();
    } catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this lesson plan?")) return;
    try { 
      await api.deleteLessonPlan(id); 
      setMsg({ type: "success", text: "Deleted" }); 
      load(); 
    }
    catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const openEdit = (item) => {
    setForm({ 
      subject: item.subject || "", 
      unitName: item.unitName || "", 
      topic: item.topic || "", 
      plannedHours: item.plannedHours || "", 
      completedHours: item.completedHours || "", 
      academicYear: item.academicYear || "", 
      semester: item.semester || "" 
    });
    setEditItem(item); 
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader title="Lesson Plans" action={<Btn onClick={() => { setEditItem(null); setForm({ subject: "", unitName: "", topic: "", plannedHours: "", completedHours: "", academicYear: "", semester: "" }); setShowForm(true); }}>+ Add</Btn>} />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ marginBottom: 16 }}>
        <AcademicYearSemesterFilter
          academicYear={filterYear}
          semester={filterSem}
          onAcademicYear={setFilterYear}
          onSemester={setFilterSem}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Table
          columns={[
            { key: "subject", label: "Subject" },
            { key: "unitName", label: "Unit" },
            { key: "topic", label: "Topic" },
            { key: "plannedHours", label: "Planned Hrs" },
            { key: "completedHours", label: "Completed Hrs" },
            { key: "academicYear", label: "Year" },
            { key: "semester", label: "Sem" },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          data={plans}
          actions={(row) => (
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {row.status === "NOT_STARTED" ? (
                <>
                  <Btn size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deletePlan(row.id)}>Delete</Btn>
                </>
              ) : row.status === "IN_PROGRESS" ? (
                <Btn size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Btn>
              ) : (
                <span style={{ fontSize: 12, color: "#6b7280" }}>No actions</span>
              )}
            </div>
          )}
        />
      </div>
      {showForm && (
        <Modal title={editItem ? "Edit Lesson Plan" : "New Lesson Plan"} onClose={() => setShowForm(false)}>
          <Input label="Subject" value={form.subject} onChange={f("subject")} />
          <Input label="Unit Name" value={form.unitName} onChange={f("unitName")} />
          <Input label="Topic" value={form.topic} onChange={f("topic")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Planned Hours" type="number" value={form.plannedHours} onChange={f("plannedHours")} />
            <Input label="Completed Hours" type="number" value={form.completedHours} onChange={f("completedHours")} />
            <Input label="Academic Year" placeholder="2024-25" value={form.academicYear} onChange={f("academicYear")} />
            <Input label="Semester" placeholder="ODD / EVEN" value={form.semester} onChange={f("semester")} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={submit}>{editItem ? "Update" : "Create"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Materials ─────────────────────────────────────────────────────────────────
function MaterialsSection() {
  const [itemsRaw, setItemsRaw] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "", academicYear: "", semester: "", file: null });

  const load = () => api.getMyMaterials().then(r => setItemsRaw(r.data?.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const items = useMemo(() => {
    let list = itemsRaw;
    if (filterYear) list = list.filter((x) => academicYearsMatch(filterYear, x.academicYear));
    if (filterSem) {
      const s = filterSem.toUpperCase();
      list = list.filter((x) => (x.semester || "").toUpperCase() === s);
    }
    return list;
  }, [itemsRaw, filterYear, filterSem]);

  const submit = async () => {
    try {
      if (editItem) {
        await api.updateMaterial(editItem.id, { title: form.title, subject: form.subject, academicYear: form.academicYear, semester: form.semester });
        setMsg({ type: "success", text: "Updated!" });
      } else {
        const fd = new FormData();
        fd.append("file", form.file);
        fd.append("title", form.title);
        fd.append("subject", form.subject);
        fd.append("academicYear", form.academicYear);
        fd.append("semester", form.semester);
        await api.createMaterial(fd);
        setMsg({ type: "success", text: "Uploaded!" });
      }
      setShowForm(false); setEditItem(null); load();
    } catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const action = async (fn, id, label) => {
    if (!window.confirm(`${label}?`)) return;
    try { await fn(id); setMsg({ type: "success", text: `${label} done` }); load(); }
    catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const openEdit = (item) => {
    setForm({ 
      title: item.title || "", 
      subject: item.subject || "", 
      academicYear: item.academicYear || "", 
      semester: item.semester || "", 
      file: null 
    });
    setEditItem(item); 
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader title="Materials" action={<Btn onClick={() => { setEditItem(null); setForm({ title: "", subject: "", academicYear: "", semester: "", file: null }); setShowForm(true); }}>+ Upload</Btn>} />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ marginBottom: 16 }}>
        <AcademicYearSemesterFilter
          academicYear={filterYear}
          semester={filterSem}
          onAcademicYear={setFilterYear}
          onSemester={setFilterSem}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Table
          columns={[
            { key: "title", label: "Title" },
            { key: "subject", label: "Subject" },
            { key: "academicYear", label: "Year" },
            { key: "semester", label: "Semester" },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          data={items}
          actions={(row) => (
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {(row.status === "DRAFT" || row.status === "REJECTED") ? (
                <>
                  <Btn size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Btn>
                  <Btn size="sm" variant="success" onClick={() => action(api.submitMaterial, row.id, "Submit")}>Submit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => action(api.deleteMaterial, row.id, "Delete")}>Delete</Btn>
                </>
              ) : (
                <>
                  <Btn size="sm" variant="outline" onClick={() => api.downloadMaterialToClient(row.id, row.title).catch((e) => setMsg({ type: "error", text: e.message || "Download failed" }))}>Download</Btn>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Submitted</span>
                </>
              )}
            </div>
          )}
        />
      </div>
      {showForm && (
        <Modal title="Upload Material" onClose={() => setShowForm(false)}>
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <Input label="Academic Year" placeholder="2024-25" value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} />
          <Input label="Semester" placeholder="ODD / EVEN" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} />
          {!editItem && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 }}>PDF File</label>
              <input type="file" accept=".pdf" onChange={e => setForm({ ...form, file: e.target.files[0] })} />
            </div>
          )}
          {editItem && <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>Note: File cannot be changed when editing</p>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={submit} disabled={!editItem && !form.file}>{editItem ? "Update" : "Upload"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── E-Resources ───────────────────────────────────────────────────────────────
function EResourcesSection() {
  const [itemsRaw, setItemsRaw] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "", academicYear: "", className: "", type: "FILE", link: "", file: null });

  const load = () => api.getMyEResources().then(r => setItemsRaw(r.data?.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const items = useMemo(() => {
    if (!filterYear) return itemsRaw;
    return itemsRaw.filter((x) => academicYearsMatch(filterYear, x.academicYear));
  }, [itemsRaw, filterYear]);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    try {
      const fd = new FormData();
      if (form.file && !editItem) fd.append("file", form.file);
      fd.append("title", form.title);
      fd.append("subject", form.subject);
      fd.append("academicYear", form.academicYear);
      fd.append("className", form.className);
      fd.append("type", form.type);
      if (form.link) fd.append("link", form.link);
      
      if (editItem) {
        await api.updateEResource(editItem.id, fd);
        setMsg({ type: "success", text: "Updated!" });
      } else {
        await api.createEResource(fd);
        setMsg({ type: "success", text: "Created!" });
      }
      setShowForm(false); setEditItem(null); load();
    } catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const action = async (fn, id, label) => {
    if (!window.confirm(`${label}?`)) return;
    try { await fn(id); setMsg({ type: "success", text: `${label} done` }); load(); }
    catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const openEdit = (item) => {
    setForm({ 
      title: item.title || "", 
      subject: item.subject || "", 
      academicYear: item.academicYear || "", 
      className: item.className || "", 
      type: item.type || "FILE", 
      link: item.link || "", 
      file: null 
    });
    setEditItem(item); 
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader title="E-Resources" action={<Btn onClick={() => { setEditItem(null); setForm({ title: "", subject: "", academicYear: "", className: "", type: "FILE", link: "", file: null }); setShowForm(true); }}>+ Add</Btn>} />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ marginBottom: 16 }}>
        <AcademicYearSemesterFilter
          academicYear={filterYear}
          semester=""
          onAcademicYear={setFilterYear}
          onSemester={() => {}}
          showSemester={false}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Table
          columns={[
            { key: "title", label: "Title" },
            { key: "subject", label: "Subject" },
            { key: "className", label: "Class" },
            { key: "type", label: "Type" },
            { key: "academicYear", label: "Year" },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          data={items}
          actions={(row) => (
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {(row.status === "DRAFT" || row.status === "REJECTED") ? (
                <>
                  <Btn size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Btn>
                  <Btn size="sm" variant="success" onClick={() => action(api.submitEResource, row.id, "Submit")}>Submit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => action(api.deleteEResource, row.id, "Delete")}>Delete</Btn>
                </>
              ) : (
                <>
                  {row.type === "FILE" && (
                    <Btn size="sm" variant="outline" onClick={() => api.downloadEResourceToClient(row.id, row.fileName).catch((e) => setMsg({ type: "error", text: e.message || "Download failed" }))}>Download</Btn>
                  )}
                  {row.type === "LINK" && row.link && (
                    <Btn size="sm" variant="outline" onClick={() => window.open(row.link, "_blank", "noopener,noreferrer")}>Open link</Btn>
                  )}
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Read-only</span>
                </>
              )}
            </div>
          )}
        />
      </div>
      {showForm && (
        <Modal title={editItem ? "Edit E-Resource" : "Add E-Resource"} onClose={() => setShowForm(false)}>
          <Input label="Title" value={form.title} onChange={f("title")} />
          <Input label="Subject" value={form.subject} onChange={f("subject")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Academic Year" placeholder="2024-25" value={form.academicYear} onChange={f("academicYear")} />
            <Input label="Class Name" value={form.className} onChange={f("className")} />
          </div>
          <Select label="Type" value={form.type} onChange={f("type")}>
            <option value="FILE">File</option>
            <option value="LINK">Link</option>
          </Select>
          {form.type === "LINK" ? (
            <Input label="URL" value={form.link} onChange={f("link")} />
          ) : (
            !editItem && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 }}>File</label>
                <input type="file" onChange={e => setForm({ ...form, file: e.target.files[0] })} />
              </div>
            )
          )}
          {editItem && form.type === "FILE" && <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>Note: File cannot be changed when editing</p>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={submit}>{editItem ? "Update" : "Create"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Video Lectures ────────────────────────────────────────────────────────────
function VideoLecturesSection() {
  const [itemsRaw, setItemsRaw] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "", academicYear: "", className: "", videoUrl: "" });

  const load = () => api.getMyVideoLectures().then(r => setItemsRaw(r.data?.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const items = useMemo(() => {
    if (!filterYear) return itemsRaw;
    return itemsRaw.filter((x) => academicYearsMatch(filterYear, x.academicYear));
  }, [itemsRaw, filterYear]);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    try {
      if (editItem) await api.updateVideoLecture(editItem.id, form);
      else await api.createVideoLecture(form);
      setMsg({ type: "success", text: editItem ? "Updated!" : "Created!" });
      setShowForm(false); setEditItem(null); load();
    } catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const action = async (fn, id, label) => {
    if (!window.confirm(`${label}?`)) return;
    try { await fn(id); setMsg({ type: "success", text: `${label} done` }); load(); }
    catch (e) { setMsg({ type: "error", text: e.response?.data?.message || "Failed" }); }
  };

  const openEdit = (item) => {
    setForm({ 
      title: item.title || "", 
      subject: item.subject || "", 
      academicYear: item.academicYear || "", 
      className: item.className || "", 
      videoUrl: item.videoUrl || "" 
    });
    setEditItem(item); 
    setShowForm(true);
  };

  return (
    <div>
      <PageHeader title="Video Lectures" action={<Btn onClick={() => { setEditItem(null); setForm({ title: "", subject: "", academicYear: "", className: "", videoUrl: "" }); setShowForm(true); }}>+ Add</Btn>} />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ marginBottom: 16 }}>
        <AcademicYearSemesterFilter
          academicYear={filterYear}
          semester=""
          onAcademicYear={setFilterYear}
          onSemester={() => {}}
          showSemester={false}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Table
          columns={[
            { key: "title", label: "Title" },
            { key: "subject", label: "Subject" },
            { key: "className", label: "Class" },
            { key: "academicYear", label: "Year" },
            { key: "videoUrl", label: "URL", render: (v) => v ? <a href={v} target="_blank" rel="noreferrer" style={{ color: "#1a3a5c" }}>🔗 View</a> : "—" },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          data={items}
          actions={(row) => (
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {(row.status === "DRAFT" || row.status === "REJECTED") ? (
                <>
                  <Btn size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Btn>
                  <Btn size="sm" variant="success" onClick={() => action(api.submitVideoLecture, row.id, "Submit")}>Submit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => action(api.deleteVideoLecture, row.id, "Delete")}>Delete</Btn>
                </>
              ) : (
                <span style={{ fontSize: 12, color: "#6b7280" }}>No actions</span>
              )}
            </div>
          )}
        />
      </div>
      {showForm && (
        <Modal title={editItem ? "Edit Video Lecture" : "Add Video Lecture"} onClose={() => setShowForm(false)}>
          <Input label="Title" value={form.title} onChange={f("title")} />
          <Input label="Subject" value={form.subject} onChange={f("subject")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Academic Year" placeholder="2024-25" value={form.academicYear} onChange={f("academicYear")} />
            <Input label="Class Name" value={form.className} onChange={f("className")} />
          </div>
          <Input label="Video URL" value={form.videoUrl} onChange={f("videoUrl")} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={submit}>{editItem ? "Update" : "Create"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Timetable ─────────────────────────────────────────────────────────────────
function TimetableSection() {
  const [timetables, setTimetables] = useState([]);
  const [msg, setMsg] = useState(null);
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  const load = () =>
    api.getTimetables({ academicYear: academicYear || undefined, semester: semester || undefined }).then((r) => {
      const raw = r.data?.data ?? r.data ?? [];
      setTimetables(api.distinctTimetablePlans(Array.isArray(raw) ? raw : []));
    }).catch(() => {});
  useEffect(() => { load(); }, [academicYear, semester]);

  const download = async (params) => {
    try {
      await api.downloadTimetableToClient(params, "timetable.xlsx");
    } catch (e) {
      setMsg({ type: "error", text: e.message || "Download failed" });
    }
  };

  return (
    <div>
      <PageHeader title="Timetable" />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ marginBottom: 16 }}>
        <AcademicYearSemesterFilter
          academicYear={academicYear}
          semester={semester}
          onAcademicYear={setAcademicYear}
          onSemester={setSemester}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Table
          columns={[
            { key: "academicYear", label: "Academic Year" },
            { key: "semester", label: "Semester" },
          ]}
          data={timetables}
          actions={(row) => (
            <Btn size="sm" onClick={() => download({ academicYear: row.academicYear, semester: row.semester })}>Download</Btn>
          )}
        />
      </div>
    </div>
  );
}

// ── Curriculum ─────────────────────────────────────────────────────────────────
function CurriculumSection() {
  const [itemsRaw, setItemsRaw] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [msg, setMsg] = useState(null);

  const load = () => api.getCurriculums({ academicYear: filterYear || undefined }).then(r => setItemsRaw(r.data?.data || [])).catch(() => {});
  useEffect(() => { load(); }, [filterYear]);

  const items = useMemo(() => {
    if (!filterSem) return itemsRaw;
    const s = filterSem.toUpperCase();
    return itemsRaw.filter((c) => (c.semester || "").toUpperCase() === s);
  }, [itemsRaw, filterSem]);

  const download = async (id, fileName) => {
    try {
      await api.downloadCurriculumToClient(id, fileName || "curriculum.pdf");
    } catch (e) {
      setMsg({ type: "error", text: e.message || "Download failed" });
    }
  };

  return (
    <div>
      <PageHeader title="Curriculum & Syllabus" />
      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}
      <div style={{ marginBottom: 16 }}>
        <AcademicYearSemesterFilter
          academicYear={filterYear}
          semester={filterSem}
          onAcademicYear={setFilterYear}
          onSemester={setFilterSem}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Table
          columns={[
            { key: "fileName", label: "File" },
            { key: "academicYear", label: "Year" },
            { key: "semester", label: "Semester" },
            { key: "regulation", label: "Regulation" },
          ]}
          data={items}
          actions={(row) => (
            <Btn size="sm" onClick={() => download(row.id, row.fileName)}>Download</Btn>
          )}
        />
      </div>
    </div>
  );
}

// ── Dashboard Overview ────────────────────────────────────────────────────────
function DashboardOverview({ onNavigate }) {
  const [counts, setCounts] = useState({ lessonPlans: 0, materials: 0, eresources: 0, videos: 0 });
  useEffect(() => {
    Promise.allSettled([
      api.getMyLessonPlans(),
      api.getMyMaterials(),
      api.getMyEResources(),
      api.getMyVideoLectures(),
    ]).then(([lp, mat, er, vl]) => {
      setCounts({
        lessonPlans: lp.value?.data?.data?.length || 0,
        materials: mat.value?.data?.data?.length || 0,
        eresources: er.value?.data?.data?.length || 0,
        videos: vl.value?.data?.data?.length || 0,
      });
    });
  }, []);

  return (
    <div>
      <PageHeader title="Faculty Dashboard" subtitle="Welcome back! Here's your academic overview." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Card title="Lesson Plans" value={counts.lessonPlans} icon="📋" color="#1a3a5c" />
        <Card title="Materials" value={counts.materials} icon="📁" color="#16a34a" />
        <Card title="E-Resources" value={counts.eresources} icon="🔗" color="#d97706" />
        <Card title="Video Lectures" value={counts.videos} icon="🎥" color="#7c3aed" />
      </div>
      <div style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#1a3a5c" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn onClick={() => onNavigate("lessonplans")}>📋 New Lesson Plan</Btn>
          <Btn variant="outline" onClick={() => onNavigate("materials")}>📁 Upload Material</Btn>
          <Btn variant="outline" onClick={() => onNavigate("eresources")}>🔗 Add E-Resource</Btn>
          <Btn variant="outline" onClick={() => onNavigate("videoLectures")}>🎥 Add Video Lecture</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FacultyDashboard() {
  const [active, setActive] = useState("dashboard");

  const sections = {
    dashboard: <DashboardOverview onNavigate={setActive} />,
    profile: <ProfileSection />,
    lessonplans: <LessonPlansSection />,
    materials: <MaterialsSection />,
    eresources: <EResourcesSection />,
    videoLectures: <VideoLecturesSection />,
    timetable: <TimetableSection />,
    curriculum: <CurriculumSection />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" }}>
      <Header />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar role={ROLE} active={active} onSelect={setActive} />
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {sections[active] || <DashboardOverview onNavigate={setActive} />}
        </main>
      </div>
    </div>
  );
}
