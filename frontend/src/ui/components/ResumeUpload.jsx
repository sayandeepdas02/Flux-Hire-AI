// // src/ui/components/ResumeUpload.jsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addCandidate } from "../../slices/candidateSlice";
// import mammoth from "mammoth";
// import { parsePDF } from "../utils/parsePDF";

// export default function ResumeUpload() {
//   const dispatch = useDispatch();
//   const [file, setFile] = useState(null);
//   const [resumeText, setResumeText] = useState(""); // Store extracted text
//   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
//   const [missingFields, setMissingFields] = useState([]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const ext = selected.name.split(".").pop().toLowerCase();
//     if (!["pdf", "docx"].includes(ext)) {
//       alert("Only PDF or DOCX files are allowed!");
//       return;
//     }

//     setFile(selected);
//     parseResume(selected, ext);
//   };

//   // Parse PDF or DOCX
//   const parseResume = async (file, ext) => {
//     try {
//       let text = "";

//       if (ext === "pdf") {
//         text = await parsePDF(file);
//       } else if (ext === "docx") {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         text = result.value;
//       }


      

//       // Store the extracted text
//       setResumeText(text);

//       // Simple regex to extract Name, Email, Phone
//       const nameMatch = text.match(/Name[:\s]*([A-Za-z ]+)/i);
//       const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
//       const phoneMatch = text.match(/(\+?\d{1,4}[-\s]?)?\d{10}/);

//       const extracted = {
//         name: nameMatch ? nameMatch[1].trim() : "",
//         email: emailMatch ? emailMatch[0].trim() : "",
//         phone: phoneMatch ? phoneMatch[0].trim() : "",
//       };

//       setFields(extracted);

//       // Identify missing fields
//       const missing = Object.entries(extracted)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);
//       setMissingFields(missing);

//       // If all fields present, dispatch addCandidate
//       if (missing.length === 0) {
//         dispatch(addCandidate({ 
//           ...extracted, 
//           resumeText: text // Store text, not file
//         }));
//         alert("Candidate added successfully!");
//       }
//     } catch (err) {
//       console.error("Error parsing resume:", err);
//       alert("Failed to parse resume. Please try a different file.");
//     }
//   };

//   // Handle missing fields input
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFields({ ...fields, [name]: value });
//   };

//   const handleSubmitMissing = () => {
//     dispatch(
//       addCandidate({
//         name: fields.name.trim(),
//         email: fields.email.trim(),
//         phone: fields.phone.trim(),
//         resumeText: resumeText, // Store text, not file
//       })
//     );
//     setMissingFields([]);
//     alert("Candidate added successfully!");
//   };

//   return (
//     <div style={{ marginTop: "1rem" }}>
//       <h3>Upload Your Resume (PDF/DOCX)</h3>
//       <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />

//       {missingFields.length > 0 && (
//         <div style={{ marginTop: "1rem" }}>
//           <h4>Please fill the missing fields:</h4>
//           {missingFields.includes("name") && (
//             <div>
//               <label>Name:</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={fields.name}
//                 onChange={handleFieldChange}
//               />
//             </div>
//           )}
//           {missingFields.includes("email") && (
//             <div>
//               <label>Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={fields.email}
//                 onChange={handleFieldChange}
//               />
//             </div>
//           )}
//           {missingFields.includes("phone") && (
//             <div>
//               <label>Phone:</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={fields.phone}
//                 onChange={handleFieldChange}
//               />
//             </div>
//           )}
//           <button onClick={handleSubmitMissing} style={{ marginTop: "0.5rem" }}>
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }




















// // src/ui/components/ResumeUpload.jsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addCandidate } from "../../slices/candidateSlice";
// import mammoth from "mammoth";
// import { parsePDF } from "../../utils/parsePDF.js";

// export default function ResumeUpload() {
//   const dispatch = useDispatch();
//   const [file, setFile] = useState(null);
//   const [resumeText, setResumeText] = useState("");
//   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
//   const [missingFields, setMissingFields] = useState([]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const ext = selected.name.split(".").pop().toLowerCase();
//     if (!["pdf", "docx"].includes(ext)) {
//       alert("Only PDF or DOCX files are allowed!");
//       return;
//     }

//     setFile(selected);
//     parseResume(selected, ext);
//   };

//   // Parse PDF or DOCX
//   const parseResume = async (file, ext) => {
//     try {
//       let text = "";

//       if (ext === "pdf") {
//         console.log("📄 Starting PDF parsing...");
//         text = await parsePDF(file);
//         console.log("📋 PDF text extracted (first 200 chars):", text.substring(0, 200));
//       } else if (ext === "docx") {
//         console.log("📝 Starting DOCX parsing...");
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         text = result.value;
//         console.log("📋 DOCX text extracted (first 200 chars):", text.substring(0, 200));
//       }

//       // Store the extracted text
//       setResumeText(text);

//       // Simple regex to extract Name, Email, Phone
//       const nameMatch = text.match(/Name[:\s]*([A-Za-z ]+)/i);
//       const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
//       const phoneMatch = text.match(/(\+?\d{1,4}[-\s]?)?\d{10}/);

//       console.log("🔍 Regex matches:", {
//         name: nameMatch ? nameMatch[0] : "not found",
//         email: emailMatch ? emailMatch[0] : "not found",
//         phone: phoneMatch ? phoneMatch[0] : "not found"
//       });

//       const extracted = {
//         name: nameMatch ? nameMatch[1].trim() : "",
//         email: emailMatch ? emailMatch[0].trim() : "",
//         phone: phoneMatch ? phoneMatch[0].trim() : "",
//       };

//       console.log("✅ Final extracted fields:", extracted);

//       setFields(extracted);

//       // Identify missing fields
//       const missing = Object.entries(extracted)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);
//       setMissingFields(missing);

//       console.log("⚠️ Missing fields:", missing);

//       // If all fields present, dispatch addCandidate
//       if (missing.length === 0) {
//         dispatch(addCandidate({ 
//           ...extracted, 
//           resumeText: text
//         }));
//         alert("Candidate added successfully!");
//       }
//     } catch (err) {
//       console.error("❌ Error parsing resume:", err);
//       alert("Failed to parse resume. Please try a different file.");
//     }
//   };

//   // Handle missing fields input
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFields({ ...fields, [name]: value });
//   };

//   const handleSubmitMissing = () => {
//     dispatch(
//       addCandidate({
//         name: fields.name.trim(),
//         email: fields.email.trim(),
//         phone: fields.phone.trim(),
//         resumeText: resumeText,
//       })
//     );
//     setMissingFields([]);
//     alert("Candidate added successfully!");
//   };

//   return (
//     <div style={{ marginTop: "1rem" }}>
//       <h3>Upload Your Resume (PDF/DOCX)</h3>
//       <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />

//       {missingFields.length > 0 && (
//         <div style={{ marginTop: "1rem" }}>
//           <h4>Please fill the missing fields:</h4>
//           {missingFields.includes("name") && (
//             <div>
//               <label>Name:</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={fields.name}
//                 onChange={handleFieldChange}
//               />
//             </div>
//           )}
//           {missingFields.includes("email") && (
//             <div>
//               <label>Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={fields.email}
//                 onChange={handleFieldChange}
//               />
//             </div>
//           )}
//           {missingFields.includes("phone") && (
//             <div>
//               <label>Phone:</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={fields.phone}
//                 onChange={handleFieldChange}
//               />
//             </div>
//           )}
//           <button onClick={handleSubmitMissing} style={{ marginTop: "0.5rem" }}>
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }




















// // src/ui/components/ResumeUpload.jsx
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addCandidate, updateCandidateField } from "../../slices/candidateSlice";
// import mammoth from "mammoth";
// import { parsePDF } from "../../utils/parsePDF.js";

// export default function ResumeUpload() {
//   const dispatch = useDispatch();
//   const candidates = useSelector((state) => state.candidate.candidates);
//   const [file, setFile] = useState(null);
//   const [resumeText, setResumeText] = useState("");
//   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
//   const [missingFields, setMissingFields] = useState([]);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const ext = selected.name.split(".").pop().toLowerCase();
//     if (!["pdf", "docx"].includes(ext)) {
//       alert("Only PDF or DOCX files are allowed!");
//       return;
//     }

//     setFile(selected);
//     parseResume(selected, ext);
//   };

//   // Parse PDF or DOCX
//   const parseResume = async (file, ext) => {
//     try {
//       let text = "";

//       if (ext === "pdf") {
//         text = await parsePDF(file);
//       } else if (ext === "docx") {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         text = result.value;
//       }

//       setResumeText(text);

//       // Extract Name, Email, Phone
//       const nameMatch = text.match(/Name[:\s]*([A-Za-z ]+)/i);
//       const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
//       const phoneMatch = text.match(/(\+?\d{1,4}[-\s]?)?\d{10}/);

//       const extracted = {
//         name: nameMatch ? nameMatch[1].trim() : "",
//         email: emailMatch ? emailMatch[0].trim() : "",
//         phone: phoneMatch ? phoneMatch[0].trim() : "",
//       };

//       setFields(extracted);

//       // Identify missing fields
//       const missing = Object.entries(extracted)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);
//       setMissingFields(missing);

//       // ✅ If all fields present, check if candidate already exists
//       if (missing.length === 0) {
//         const existing = candidates.find(
//           (c) => c.email.toLowerCase() === extracted.email.toLowerCase()
//         );

//         if (existing) {
//           // Update existing candidate resumeText only
//           dispatch(
//             updateCandidateField({
//               id: existing.id,
//               field: "resumeText",
//               value: text,
//             })
//           );
//           alert("Resume updated for existing candidate!");
//         } else {
//           // Add new candidate
//           dispatch(addCandidate({ ...extracted, resumeText: text }));
//           alert("Candidate added successfully!");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error parsing resume:", err);
//       alert("Failed to parse resume. Please try a different file.");
//     }
//   };

//   // Handle missing fields input
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFields({ ...fields, [name]: value });
//   };

//   const handleSubmitMissing = () => {
//     const existing = candidates.find(
//       (c) => c.email.toLowerCase() === fields.email.toLowerCase()
//     );

//     if (existing) {
//       // Update missing fields for existing candidate
//       dispatch(updateCandidateField({ id: existing.id, field: "name", value: fields.name }));
//       dispatch(updateCandidateField({ id: existing.id, field: "phone", value: fields.phone }));
//       dispatch(updateCandidateField({ id: existing.id, field: "resumeText", value: resumeText }));
//       alert("Candidate info updated!");
//     } else {
//       // Add as new candidate
//       dispatch(
//         addCandidate({
//           name: fields.name.trim(),
//           email: fields.email.trim(),
//           phone: fields.phone.trim(),
//           resumeText,
//         })
//       );
//       alert("Candidate added successfully!");
//     }

//     setMissingFields([]);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="font-semibold text-gray-800">Upload Your Resume (PDF/DOCX)</h3>
//       <input
//         type="file"
//         accept=".pdf,.docx"
//         onChange={handleFileChange}
//         className="block w-full border border-gray-300 rounded-md p-2"
//       />

//       {missingFields.length > 0 && (
//         <div className="mt-4 space-y-2">
//           <h4 className="font-medium text-gray-700">Please fill the missing fields:</h4>

//           {missingFields.includes("name") && (
//             <div>
//               <label className="block text-sm font-medium">Name:</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={fields.name}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {missingFields.includes("email") && (
//             <div>
//               <label className="block text-sm font-medium">Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={fields.email}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {missingFields.includes("phone") && (
//             <div>
//               <label className="block text-sm font-medium">Phone:</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={fields.phone}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           <button
//             onClick={handleSubmitMissing}
//             className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }





















// // src/ui/components/ResumeUpload.jsx
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addCandidateToSession, evaluateCandidateSuccess } from "../../slices/sessionSlice";
// import mammoth from "mammoth";
// import { parsePDF } from "../../utils/parsePDF.js";

// export default function ResumeUpload({ sessionId }) {
//   const dispatch = useDispatch();
//   const session = useSelector((state) =>
//     state.session.sessions.find((s) => s.id === sessionId)
//   );
//   const [file, setFile] = useState(null);
//   const [resumeText, setResumeText] = useState("");
//   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
//   const [missingFields, setMissingFields] = useState([]);

//   if (!session) {
//     return <p className="text-red-600">⚠️ Session not found!</p>;
//   }

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const ext = selected.name.split(".").pop().toLowerCase();
//     if (!["pdf", "docx"].includes(ext)) {
//       alert("Only PDF or DOCX files are allowed!");
//       return;
//     }

//     setFile(selected);
//     parseResume(selected, ext);
//   };

//   // Parse PDF or DOCX
//   const parseResume = async (file, ext) => {
//     try {
//       let text = "";

//       if (ext === "pdf") {
//         text = await parsePDF(file);
//       } else if (ext === "docx") {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         text = result.value;
//       }

//       setResumeText(text);

//       // Extract Name, Email, Phone
//       const nameMatch = text.match(/Name[:\s]*([A-Za-z ]+)/i);
//       const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
//       const phoneMatch = text.match(/(\+?\d{1,4}[-\s]?)?\d{10}/);

//       const extracted = {
//         name: nameMatch ? nameMatch[1].trim() : "",
//         email: emailMatch ? emailMatch[0].trim() : "",
//         phone: phoneMatch ? phoneMatch[0].trim() : "",
//       };

//       setFields(extracted);

//       // Identify missing fields
//       const missing = Object.entries(extracted)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);
//       setMissingFields(missing);

//       // ✅ If all fields present, add candidate to session
//       if (missing.length === 0) {
//         dispatch(addCandidateToSession({ sessionId, candidate: { ...extracted, resumeText: text } }));
//         alert("Candidate added to session successfully!");
//       }
//     } catch (err) {
//       console.error("❌ Error parsing resume:", err);
//       alert("Failed to parse resume. Please try a different file.");
//     }
//   };

//   // Handle missing fields input
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFields({ ...fields, [name]: value });
//   };

//   const handleSubmitMissing = () => {
//     dispatch(
//       addCandidateToSession({
//         sessionId,
//         candidate: {
//           name: fields.name.trim(),
//           email: fields.email.trim(),
//           phone: fields.phone.trim(),
//           resumeText,
//         },
//       })
//     );
//     setMissingFields([]);
//     alert("Candidate added with missing details filled!");
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="font-semibold text-gray-800">Upload Your Resume (PDF/DOCX)</h3>
//       <input
//         type="file"
//         accept=".pdf,.docx"
//         onChange={handleFileChange}
//         className="block w-full border border-gray-300 rounded-md p-2"
//       />

//       {missingFields.length > 0 && (
//         <div className="mt-4 space-y-2">
//           <h4 className="font-medium text-gray-700">Please fill the missing fields:</h4>

//           {missingFields.includes("name") && (
//             <div>
//               <label className="block text-sm font-medium">Name:</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={fields.name}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {missingFields.includes("email") && (
//             <div>
//               <label className="block text-sm font-medium">Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={fields.email}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {missingFields.includes("phone") && (
//             <div>
//               <label className="block text-sm font-medium">Phone:</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={fields.phone}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           <button
//             onClick={handleSubmitMissing}
//             className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }























// // src/ui/components/ResumeUpload.jsx
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addCandidate, updateCandidateField } from "../../slices/candidateSlice";
// import { addCandidateToSession } from "../../slices/sessionSlice";
// import mammoth from "mammoth";
// import { parsePDF } from "../../utils/parsePDF.js";

// export default function ResumeUpload({ sessionId = null, onSubmit }) {
//   const dispatch = useDispatch();

//   const candidates = useSelector((state) => state.candidate?.candidates || []);
//   const session = useSelector((state) =>
//     sessionId ? state.session.sessions.find((s) => s.id === sessionId) : null
//   );

//   const [file, setFile] = useState(null);
//   const [resumeText, setResumeText] = useState("");
//   const [fields, setFields] = useState({ name: "", email: "", phone: "" });
//   const [missingFields, setMissingFields] = useState([]);

//   if (sessionId && !session) {
//     return <p className="text-red-600">⚠️ Session not found!</p>;
//   }

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const ext = selected.name.split(".").pop().toLowerCase();
//     if (!["pdf", "docx"].includes(ext)) {
//       alert("Only PDF or DOCX files are allowed!");
//       return;
//     }

//     setFile(selected);
//     parseResume(selected, ext);
//   };

//   // Parse PDF or DOCX
//   const parseResume = async (file, ext) => {
//     try {
//       let text = "";

//       if (ext === "pdf") {
//         text = await parsePDF(file);
//       } else if (ext === "docx") {
//         const arrayBuffer = await file.arrayBuffer();
//         const result = await mammoth.extractRawText({ arrayBuffer });
//         text = result.value;
//       }

//       setResumeText(text);

//       // Extract Name, Email, Phone
//       const nameMatch = text.match(/Name[:\s]*([A-Za-z ]+)/i);
//       const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
//       const phoneMatch = text.match(/(\+?\d{1,4}[-\s]?)?\d{10}/);

//       const extracted = {
//         name: nameMatch ? nameMatch[1].trim() : "",
//         email: emailMatch ? emailMatch[0].trim() : "",
//         phone: phoneMatch ? phoneMatch[0].trim() : "",
//       };

//       setFields(extracted);

//       // Identify missing fields
//       const missing = Object.entries(extracted)
//         .filter(([_, value]) => !value)
//         .map(([key]) => key);
//       setMissingFields(missing);

//       // ✅ If all fields present, handle candidate immediately
//       if (missing.length === 0) {
//         handleCandidate(extracted, text);
//       }
//     } catch (err) {
//       console.error("❌ Error parsing resume:", err);
//       alert("Failed to parse resume. Please try a different file.");
//     }
//   };

//   // Common handler for adding candidate (session OR standalone)
//   const handleCandidate = (data, resumeTextValue) => {
//     if (sessionId) {
//       // Session mode
//       dispatch(addCandidateToSession({ sessionId, candidate: { ...data, resumeText: resumeTextValue } }));
//       alert("Candidate added to session!");
//       if (onSubmit) onSubmit({ ...data, resumeText: resumeTextValue });
//     } else {
//       // Standalone (interviewee page)
//       const existing = candidates.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
//       if (existing) {
//         dispatch(updateCandidateField({ id: existing.id, field: "resumeText", value: resumeTextValue }));
//         alert("Resume updated for existing candidate!");
//       } else {
//         dispatch(addCandidate({ ...data, resumeText: resumeTextValue }));
//         alert("Candidate added successfully!");
//       }
//     }
//   };

//   // Handle missing fields input
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFields({ ...fields, [name]: value });
//   };

//   const handleSubmitMissing = () => {
//     handleCandidate(fields, resumeText);
//     setMissingFields([]);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="font-semibold text-gray-800">Upload Your Resume (PDF/DOCX)</h3>
//       <input
//         type="file"
//         accept=".pdf,.docx"
//         onChange={handleFileChange}
//         className="block w-full border border-gray-300 rounded-md p-2"
//       />

//       {missingFields.length > 0 && (
//         <div className="mt-4 space-y-2">
//           <h4 className="font-medium text-gray-700">Please fill the missing fields:</h4>

//           {missingFields.includes("name") && (
//             <div>
//               <label className="block text-sm font-medium">Name:</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={fields.name}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {missingFields.includes("email") && (
//             <div>
//               <label className="block text-sm font-medium">Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={fields.email}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           {missingFields.includes("phone") && (
//             <div>
//               <label className="block text-sm font-medium">Phone:</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={fields.phone}
//                 onChange={handleFieldChange}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           )}

//           <button
//             onClick={handleSubmitMissing}
//             className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }





















// src/ui/components/ResumeUpload.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCandidate, updateCandidateField } from "../../slices/candidateSlice";
import { addCandidateToSession } from "../../slices/sessionSlice";
import mammoth from "mammoth";
import { parsePDF } from "../../utils/parsePDF.js";

export default function ResumeUpload({ sessionId = null, onSubmit }) {
  const dispatch = useDispatch();

  const candidates = useSelector((state) => state.candidate?.candidates || []);
  const session = useSelector((state) =>
    sessionId ? state.session.sessions.find((s) => s.id === sessionId) : null
  );

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [missingFields, setMissingFields] = useState([]);

  if (sessionId && !session) {
    return <p className="text-red-600">⚠️ Session not found!</p>;
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) {
      alert("Only PDF or DOCX files are allowed!");
      return;
    }

    setFile(selected);
    parseResume(selected, ext);
  };

  // Parse PDF or DOCX
  const parseResume = async (file, ext) => {
    try {
      let text = "";

      if (ext === "pdf") {
        text = await parsePDF(file);
      } else if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      }

      setResumeText(text);

      // Extract Name, Email, Phone
      const nameMatch = text.match(/Name[:\s]*([A-Za-z ]+)/i);
      const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
      const phoneMatch = text.match(/(\+?\d{1,4}[-\s]?)?\d{10}/);

      const extracted = {
        name: nameMatch ? nameMatch[1].trim() : "",
        email: emailMatch ? emailMatch[0].trim() : "",
        phone: phoneMatch ? phoneMatch[0].trim() : "",
      };

      setFields(extracted);

      // Identify missing fields
      const missing = Object.entries(extracted)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      setMissingFields(missing);

      // ✅ If all fields present
      if (missing.length === 0) {
        handleCandidate(extracted, text);
      }
    } catch (err) {
      console.error("❌ Error parsing resume:", err);
      alert("Failed to parse resume. Please try a different file.");
    }
  };

  // Common handler
  const handleCandidate = (data, resumeTextValue) => {
    if (sessionId) {
      // Session mode
      dispatch(addCandidateToSession({ sessionId, candidate: { ...data, resumeText: resumeTextValue } }));

      // ✅ find the newly created candidate in session
      const updatedSession = sessionId
        ? JSON.parse(JSON.stringify(session)) // clone
        : null;

      const newCandidate = updatedSession?.candidates.find(
        (c) => c.email.toLowerCase() === data.email.toLowerCase()
      );

      if (onSubmit && newCandidate) {
        onSubmit(newCandidate); // pass candidate object with id
      }

      alert("Candidate added to session!");
    } else {
      // Standalone (interviewee page)
      const existing = candidates.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
      if (existing) {
        dispatch(updateCandidateField({ id: existing.id, field: "resumeText", value: resumeTextValue }));
        alert("Resume updated for existing candidate!");
      } else {
        dispatch(addCandidate({ ...data, resumeText: resumeTextValue }));
        alert("Candidate added successfully!");
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmitMissing = () => {
    handleCandidate(fields, resumeText);
    setMissingFields([]);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Upload Your Resume (PDF/DOCX)</h3>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded-md p-2"
      />

      {missingFields.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-700">Please fill the missing fields:</h4>

          {missingFields.includes("name") && (
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}

          {missingFields.includes("email") && (
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}

          {missingFields.includes("phone") && (
            <div>
              <label className="block text-sm font-medium">Phone:</label>
              <input
                type="text"
                name="phone"
                value={fields.phone}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}

          <button
            onClick={handleSubmitMissing}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
