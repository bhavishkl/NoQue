import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchQueues = createAsyncThunk(
  'queue/fetchQueues',
  async (search, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/queues${search ? `?search=${search}` : ''}`)
      if (!response.ok) throw new Error('Failed to fetch queues')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchQueueDetails = createAsyncThunk(
  'queue/fetchQueueDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/queue/${id}`)
      if (!response.ok) throw new Error('Failed to fetch queue details')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchQueueAnalytics = createAsyncThunk(
  'queue/fetchQueueAnalytics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/queue/analytics/${id}`)
      if (!response.ok) throw new Error('Failed to fetch queue analytics')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOwnerQueues = createAsyncThunk(
    'queue/fetchOwnerQueues',
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('/api/queue/queue-owner')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch owner queues')
        }
        const data = await response.json()
        console.log('Fetched owner queues:', data) // Keep this line for debugging
        return data
      } catch (error) {
        console.error('Error fetching owner queues:', error)
        return rejectWithValue(error.message)
      }
    }
  )
export const deleteQueue = createAsyncThunk(
  'queue/deleteQueue',
  async (queueId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/queue/delete-queue?queueId=${queueId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete queue')
      return queueId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateQueue = createAsyncThunk(
  'queue/updateQueue',
  async ({ id, ...queueData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/queue/update-queue?queueId=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queueData),
      })
      if (!response.ok) throw new Error('Failed to update queue')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchQueueMembers = createAsyncThunk(
  'queue/fetchQueueMembers',
  async (queueId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/queue/members?queueId=${queueId}`)
      if (!response.ok) throw new Error('Failed to fetch queue members')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateMemberStatus = createAsyncThunk(
  'queue/updateMemberStatus',
  async ({ memberId, queueId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/queue/update-member-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, queueId, status }),
      })
      if (!response.ok) throw new Error('Failed to update member status')
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const queueSlice = createSlice({
  name: 'queue',
  initialState: {
    queues: [],
    currentQueue: null,
    analytics: null,
    members: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQueues.fulfilled, (state, action) => {
        state.queues = action.payload
        state.loading = false
      })
      .addCase(fetchQueues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchQueueDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQueueDetails.fulfilled, (state, action) => {
        state.currentQueue = action.payload
        state.loading = false
      })
      .addCase(fetchQueueDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchQueueAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQueueAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload
        state.loading = false
      })
      .addCase(fetchQueueAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateQueue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateQueue.fulfilled, (state, action) => {
        state.currentQueue = action.payload
        state.loading = false
      })
      .addCase(updateQueue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchQueueMembers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchQueueMembers.fulfilled, (state, action) => {
        state.loading = false
        state.members = action.payload.members
      })
      .addCase(fetchQueueMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateMemberStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        state.members = state.members.map(member =>
          member.id === action.payload.id ? action.payload : member
        )
        state.loading = false
      })
      .addCase(updateMemberStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOwnerQueues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOwnerQueues.fulfilled, (state, action) => {
        state.queues = action.payload
        state.loading = false
      })
      .addCase(fetchOwnerQueues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default queueSlice.reducer