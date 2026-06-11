import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import ProgressBar from '../components/ui/ProgressBar';
import useResumeStore from '../stores/resumeStore';

const Resume = () => {
  const { resumes, loading, uploadResume, fetchResumes, deleteResume } = useResumeStore();
  const [uploading, setUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadResume(file, '');
      setSelectedResume(result);
      toast.success('Resume uploaded and analyzed!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResume(id);
      if (selectedResume?._id === id) setSelectedResume(null);
      toast.success('Resume deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading && resumes.length === 0) return <Loader className="min-h-[75vh]" />;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Resume Analysis</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Upload &amp; Analyze Your Resume</h1>
          <p className="mt-2 text-slate-300">Get an AI-powered resume score, skills analysis, and improvement suggestions.</p>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-4">
          <Card>
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-700 p-8 transition hover:border-sky-400/50 hover:bg-slate-900/50">
              <Upload className="h-10 w-10 text-sky-300" />
              <p className="text-sm text-slate-300">{uploading ? 'Uploading...' : 'Click to upload PDF resume'}</p>
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-semibold text-white">Your Resumes</h2>
            {resumes.length > 0 ? (
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                      selectedResume?._id === resume._id ? 'border-sky-400/50 bg-sky-400/5' : 'border-slate-800 hover:bg-slate-900/50'
                    }`}
                    onClick={() => setSelectedResume(resume)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sky-300" />
                      <div>
                        <p className="text-sm text-white">Resume</p>
                        <p className="text-xs text-slate-400">{new Date(resume.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={resume.score >= 70 ? 'success' : resume.score >= 40 ? 'warning' : 'danger'}>
                        {resume.score}%
                      </Badge>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(resume._id); }} className="text-slate-400 hover:text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No resumes uploaded yet.</p>
            )}
          </Card>
        </div>

        {selectedResume && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <Card>
              <h2 className="text-lg font-semibold text-white">Resume Score</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-4xl font-bold text-sky-300">{selectedResume.score}%</div>
                <ProgressBar value={selectedResume.score} className="flex-1" />
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white">Skills Found</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedResume.skills?.length > 0 ? (
                  selectedResume.skills.map((skill) => (
                    <Badge key={skill} variant="success">
                      <CheckCircle2 className="h-3 w-3" /> {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No skills detected</p>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white">Missing Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedResume.missingSkills?.length > 0 ? (
                  selectedResume.missingSkills.map((skill) => (
                    <Badge key={skill} variant="danger">
                      <AlertCircle className="h-3 w-3" /> {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No missing skills detected</p>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white">Suggestions</h2>
              <ul className="mt-3 space-y-2">
                {selectedResume.suggestions?.length > 0 ? (
                  selectedResume.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-0.5 text-sky-400">•</span> {s}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400">No suggestions available</li>
                )}
              </ul>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Resume;
