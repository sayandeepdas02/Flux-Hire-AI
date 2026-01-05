// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   candidates: [],
// };

// export const candidateSlice = createSlice({
//   name: "candidate",
//   initialState,
//   reducers: {
//     // Add a new candidate
//     addCandidate: (state, action) => {
//       if (!Array.isArray(state.candidates)) {
//         console.warn("state.candidates was not an array, reinitializing");
//         state.candidates = [];
//       }

//       const newCandidate = {
//         id: crypto.randomUUID(), // ✅ safer than Date.now()
//         name: action.payload.name || "",
//         email: action.payload.email || "",
//         phone: action.payload.phone || "",
//         resumeText: action.payload.resumeText || "",
//         answers: [],
//         score: null,
//         summary: "",
//         progress: 0,
//         currentIndex: 0, // ✅ track current question
//         timeLeft: 0, // ✅ track remaining time
//       };

//       state.candidates.push(newCandidate);
//     },

//     // Update candidate fields dynamically (name, email, resumeText, progress, etc.)
//     updateCandidateField: (state, action) => {
//       const { id, field, value } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate[field] = value;
//       }
//     },

//     // Add an answer for a candidate
//     addCandidateAnswer: (state, action) => {
//       const { id, question, answer, timestamp } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate.answers.push({ question, answer, timestamp });
//         candidate.progress = candidate.answers.length;
//         candidate.currentIndex = candidate.answers.length; // ✅ move to next question
//       }
//     },

//     // Update time left (for countdown timers if needed)
//     updateCandidateTimer: (state, action) => {
//       const { id, timeLeft } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate.timeLeft = timeLeft;
//       }
//     },

//     // Update final score + summary after evaluation
//     evaluateCandidateSuccess: (state, action) => {
//       const { id, score, summary } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate.score = score;
//         candidate.summary = summary;
//       }
//     },

//     // Reset all candidates
//     resetCandidates: () => initialState,
//   },
// });

// export const {
//   addCandidate,
//   updateCandidateField,
//   addCandidateAnswer,
//   updateCandidateTimer,
//   evaluateCandidateSuccess,
//   resetCandidates,
// } = candidateSlice.actions;

// export default candidateSlice.reducer;











// // src/slices/candidateSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// /**
//  * Async thunk to upsert a candidate on the backend and return the server echo.
//  * Payload should contain at minimum: { id, sessionId, name, email, resumeText, answers, score, summary, completedAt }
//  */
// export const upsertCandidate = createAsyncThunk(
//   "candidate/upsertCandidate",
//   async (payload, { rejectWithValue }) => {
//     try {
//       // adapt this URL to your backend endpoint
//       const res = await axios.post("/api/candidates/upsert", payload);
//       return res.data;
//     } catch (err) {
//       // normalize error message
//       const message =
//         err?.response?.data?.message || err.message || "Failed to upsert candidate";
//       return rejectWithValue(message);
//     }
//   }
// );

// const initialState = {
//   candidates: [],
//   saving: false, // indicates an in-flight upsert
//   error: null, // last upsert error
// };

// export const candidateSlice = createSlice({
//   name: "candidate",
//   initialState,
//   reducers: {
//     // Add a new candidate
//     addCandidate: (state, action) => {
//       if (!Array.isArray(state.candidates)) {
//         console.warn("state.candidates was not an array, reinitializing");
//         state.candidates = [];
//       }

//       const newCandidate = {
//         id: crypto.randomUUID(), // ✅ safer than Date.now()
//         name: action.payload.name || "",
//         email: action.payload.email || "",
//         phone: action.payload.phone || "",
//         resumeText: action.payload.resumeText || "",
//         answers: [],
//         score: null,
//         summary: "",
//         progress: 0,
//         currentIndex: 0, // ✅ track current question
//         timeLeft: 0, // ✅ track remaining time
//       };

//       state.candidates.push(newCandidate);
//     },

//     // Update candidate fields dynamically (name, email, resumeText, progress, etc.)
//     updateCandidateField: (state, action) => {
//       const { id, field, value } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate[field] = value;
//       }
//     },

//     // Add an answer for a candidate
//     addCandidateAnswer: (state, action) => {
//       const { id, question, answer, timestamp } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate.answers.push({ question, answer, timestamp });
//         candidate.progress = candidate.answers.length;
//         candidate.currentIndex = candidate.answers.length; // ✅ move to next question
//       }
//     },

//     // Update time left (for countdown timers if needed)
//     updateCandidateTimer: (state, action) => {
//       const { id, timeLeft } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate.timeLeft = timeLeft;
//       }
//     },

//     // Update final score + summary after evaluation
//     evaluateCandidateSuccess: (state, action) => {
//       const { id, score, summary } = action.payload;
//       const candidate = state.candidates.find((c) => c.id === id);
//       if (candidate) {
//         candidate.score = score;
//         candidate.summary = summary;
//       }
//     },

//     // Reset all candidates
//     resetCandidates: () => initialState,
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(upsertCandidate.pending, (state) => {
//         state.saving = true;
//         state.error = null;
//       })
//       .addCase(upsertCandidate.fulfilled, (state, action) => {
//         state.saving = false;
//         state.error = null;
//         const serverCandidate = action.payload;
//         if (!serverCandidate || !serverCandidate.id) {
//           // If backend returned unexpected shape, skip merge
//           return;
//         }

//         const idx = state.candidates.findIndex((c) => c.id === serverCandidate.id);
//         if (idx >= 0) {
//           // merge server returned fields into existing candidate
//           state.candidates[idx] = {
//             ...state.candidates[idx],
//             ...serverCandidate,
//           };
//         } else {
//           // candidate not found locally — add server candidate
//           state.candidates.push(serverCandidate);
//         }
//       })
//       .addCase(upsertCandidate.rejected, (state, action) => {
//         state.saving = false;
//         state.error = action.payload || "Failed to save candidate";
//       });
//   },
// });

// export const {
//   addCandidate,
//   updateCandidateField,
//   addCandidateAnswer,
//   updateCandidateTimer,
//   evaluateCandidateSuccess,
//   resetCandidates,
// } = candidateSlice.actions;

// export default candidateSlice.reducer;















// src/slices/candidateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * upsertCandidate thunk uses fetch so no extra dependency is required.
 * Backend endpoint: POST /api/candidates/upsert
 * The thunk returns `data` from the server (expected to include id).
 */
export const upsertCandidate = createAsyncThunk(
  "candidate/upsertCandidate",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/candidates/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        // try to parse JSON error if present
        let parsed;
        try { parsed = JSON.parse(body); } catch (e) { parsed = null; }
        const message = parsed?.message || `Server error: ${res.status} ${res.statusText}`;
        return rejectWithValue(message);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

const initialState = {
  candidates: [],
  saving: false,
  error: null,
};

export const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      if (!Array.isArray(state.candidates)) state.candidates = [];

      const newCandidate = {
        id: action.payload.id || crypto?.randomUUID?.() || `${Date.now()}`,
        name: action.payload.name || "",
        email: action.payload.email || "",
        phone: action.payload.phone || "",
        resumeText: action.payload.resumeText || "",
        answers: action.payload.answers || [],
        score: action.payload.score ?? null,
        summary: action.payload.summary || "",
        progress: action.payload.progress || 0,
        currentIndex: action.payload.currentIndex || 0,
        timeLeft: action.payload.timeLeft || 0,
      };

      state.candidates.push(newCandidate);
    },

    updateCandidateField: (state, action) => {
      const { id, field, value } = action.payload;
      const candidate = state.candidates.find((c) => c.id === id);
      if (candidate) candidate[field] = value;
    },

    addCandidateAnswer: (state, action) => {
      const { id, question, answer, timestamp } = action.payload;
      const candidate = state.candidates.find((c) => c.id === id);
      if (candidate) {
        candidate.answers.push({ question, answer, timestamp });
        candidate.progress = candidate.answers.length;
        candidate.currentIndex = candidate.answers.length;
      }
    },

    updateCandidateTimer: (state, action) => {
      const { id, timeLeft } = action.payload;
      const candidate = state.candidates.find((c) => c.id === id);
      if (candidate) candidate.timeLeft = timeLeft;
    },

    evaluateCandidateSuccess: (state, action) => {
      const { id, score, summary } = action.payload;
      const candidate = state.candidates.find((c) => c.id === id);
      if (candidate) {
        candidate.score = score;
        candidate.summary = summary;
      }
    },

    resetCandidates: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(upsertCandidate.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(upsertCandidate.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        const serverCandidate = action.payload;
        if (!serverCandidate || !serverCandidate.id) return;

        const idx = state.candidates.findIndex((c) => c.id === serverCandidate.id);
        if (idx >= 0) {
          state.candidates[idx] = { ...state.candidates[idx], ...serverCandidate };
        } else {
          state.candidates.push(serverCandidate);
        }
      })
      .addCase(upsertCandidate.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save candidate";
      });
  },
});

export const {
  addCandidate,
  updateCandidateField,
  addCandidateAnswer,
  updateCandidateTimer,
  evaluateCandidateSuccess,
  resetCandidates,
} = candidateSlice.actions;

export default candidateSlice.reducer;
