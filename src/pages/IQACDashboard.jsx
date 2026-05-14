import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getMyCoordinatorProfile,
  getCcmMembers,
  getCocmMembers,
  getClassIncharges,
  getClassMentors,
  getLessonPlans,
  getMaterials,
  getEResources,
  getVideoLectures,
  getDepartments,
  getFaculties
} from "../api/endpoints";

function IQACDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    ccmMembers: 0,
    cocmMembers: 0,
    classIncharges: 0,
    classMentors: 0,
    lessonPlans: 0,
    materials: 0,
    eResources: 0,
    videoLectures: 0,
    departments: 0,
    faculties: 0
  });
  const [ccmMembers, setCcmMembers] = useState([]);
  const [cocmMembers, setCocmMembers] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeSection === "ccm") fetchCcmMembers();
    if (activeSection === "cocm") fetchCocmMembers();
  }, [activeSection]);

  const fetchProfile = async () => {
    try {
      const res = await getMyCoordinatorProfile();
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const [ccm, cocm, incharge, mentor, lesson, mat, eRes, video, dept, fac] = await Promise.all([
        getCcmMembers().catch(() => ({ data: { data: [] } })),
        getCocmMembers().catch(() => ({ data: { data: [] } })),
        getClassIncharges().catch(() => ({ data: { data: [] } })),
        getClassMentors().catch(() => ({ data: { data: [] } })),
        getLessonPlans().catch(() => ({ data: [] })),
        getMaterials().catch(() => ({ data: [] })),
        getEResources().catch(() => ({ data: [] })),
        getVideoLectures().catch(() => ({ data: [] })),
        getDepartments().catch(() => ({ data: [] })),
        getFaculties().catch(() => ({ data: [] }))
      ]);
      setStats({
        ccmMembers: (ccm.data?.data || ccm.data || []).length,
        cocmMembers: (cocm.data?.data || cocm.data || []).length,
        classIncharges: (incharge.data?.data || incharge.data || []).length,
        classMentors: (mentor.data?.data || mentor.data || []).length,
        lessonPlans: (lesson.data || []).length,
        materials: (mat.data || []).length,
        eResources: (eRes.data || []).length,
        videoLectures: (video.data || []).length,
        departments: (dept.data || []).length,
        faculties: (fac.data || []).length
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchCcmMembers = async () => {
    try {
      const res = await getCcmMembers();
      setCcmMembers(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error fetching CCM members:", err);
      setCcmMembers([]);
    }
  };

  const fetchCocmMembers = async () => {
    try {
      const res = await getCocmMembers();
      setCocmMembers(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error fetching COCM members:", err);
      setCocmMembers([]);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar role="IQAC_COORDINATOR" active={activeSection} onSelect={setActiveSection} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">IQAC Coordinator Dashboard</h1>
          {profile && <p className="text-sm text-gray-600">Welcome, {profile.name}</p>}
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Departments" value={stats.departments} color="blue" />
                <StatCard title="Faculties" value={stats.faculties} color="green" />
                <StatCard title="CCM Members" value={stats.ccmMembers} color="purple" />
                <StatCard title="COCM Members" value={stats.cocmMembers} color="orange" />
                <StatCard title="Class Incharges" value={stats.classIncharges} color="indigo" />
                <StatCard title="Class Mentors" value={stats.classMentors} color="pink" />
                <StatCard title="Lesson Plans" value={stats.lessonPlans} color="teal" />
                <StatCard title="Materials" value={stats.materials} color="cyan" />
                <StatCard title="E-Resources" value={stats.eResources} color="red" />
                <StatCard title="Video Lectures" value={stats.videoLectures} color="yellow" />
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">My Profile</h2>
              {profile && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                </div>
              )}
            </div>
          )}

          {activeSection === "ccm" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Course Coordination Members (CCM)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ccmMembers.map((member, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">{member.facultyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.departmentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.courseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.academicYear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "cocm" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Course Outcome Coordination Members (COCM)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cocmMembers.map((member, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">{member.facultyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.departmentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.courseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.academicYear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500"
  };
  return (
    <div className={`${colors[color]} text-white p-6 rounded-lg shadow`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default IQACDashboard;
