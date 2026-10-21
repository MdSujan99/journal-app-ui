import axios from './axiosConfig';

/**
 * Journal API Client adhering to Swagger OpenAPI 3.0.1 spec
 */
export const journalApi = {
  /**
   * Health check
   * GET /api/health
   */
  async checkHealth() {
    try {
      const response = await axios.get('/health');
      return { success: true, data: response.data?.payload || response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all journals with their entries
   * GET /api/journal
   */
  async getAllJournals() {
    const response = await axios.get('/journal');
    const payload = response.data?.payload ?? response.data;
    return Array.isArray(payload) ? payload : [];
  },

  /**
   * Create a new journal
   * POST /api/journal
   * Body: { title, description }
   */
  async createJournal({ title, description }) {
    const response = await axios.post('/journal', {
      title: title.trim(),
      description: description ? description.trim() : '',
    });
    return response.data?.payload ?? response.data;
  },

  /**
   * Delete a journal by ID
   * DELETE /api/journal/{journalId}
   */
  async deleteJournal(journalId) {
    const response = await axios.delete(`/journal/${journalId}`);
    return response.data?.payload ?? response.data;
  },

  /**
   * Create a new entry in a journal
   * POST /api/journal/{journalId}/entry
   * Body: { title, textContent }
   */
  async createJournalEntry(journalId, { title, textContent }) {
    const response = await axios.post(`/journal/${journalId}/entry`, {
      title: title.trim(),
      textContent: textContent || '',
    });
    return response.data?.payload ?? response.data;
  },

  /**
   * Get journal entries by date range
   * GET /api/journal/{journalId}/entry?dateFrom=...&dateTo=...
   */
  async getJournalEntriesByDate(journalId, dateFrom, dateTo) {
    const response = await axios.get(`/journal/${journalId}/entry`, {
      params: {
        dateFrom: dateFrom instanceof Date ? dateFrom.toISOString() : dateFrom,
        dateTo: dateTo instanceof Date ? dateTo.toISOString() : dateTo,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default journalApi;
