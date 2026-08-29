/**
 * Gondal Clothes House - Admin Comments & Q&A Tab
 * Customer review moderation queue and product Q&A management
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Filter,
  HelpCircle,
  Send,
  Package,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { Comment, ProductQuestion } from '../../../types';

export const AdminCommentsTab: React.FC = () => {
  const { products, refreshData, showToast } = useStore();
  const comments = storeService.getComments();
  const questions = storeService.getQuestions();

  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'questions'>('reviews');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Answering question state
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const handleUpdateReviewStatus = (commentId: string, status: 'approved' | 'rejected' | 'pending') => {
    storeService.updateCommentStatus(commentId, status);
    refreshData();
    showToast(`Review marked as "${status}".`);
  };

  const handleDeleteReview = (commentId: string) => {
    storeService.deleteComment(commentId);
    refreshData();
    showToast('Review permanently deleted.');
  };

  const handleAnswerQuestion = (questionId: string) => {
    if (!answerText.trim()) return;
    storeService.answerQuestion(questionId, answerText.trim());
    setAnsweringQuestionId(null);
    setAnswerText('');
    refreshData();
    showToast('Response published to product page.');
  };

  const filteredComments = comments.filter((c) => {
    if (reviewStatusFilter !== 'all' && c.status !== reviewStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesAuthor = c.customerName.toLowerCase().includes(q);
      const matchesContent = c.comment.toLowerCase().includes(q);
      if (!matchesAuthor && !matchesContent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Review Moderation &amp; Product Q&amp;A</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Moderate genuine customer feedback, verify ratings, and answer sizing/fabric queries.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center space-x-2 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeSubTab === 'reviews'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Reviews ({comments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('questions')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeSubTab === 'questions'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Product Q&amp;A ({questions.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'reviews' ? (
        <div className="space-y-4">
          {/* Reviews Filters */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setReviewStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  reviewStatusFilter === 'pending'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                Pending Moderation ({comments.filter((c) => c.status === 'pending').length})
              </button>
              <button
                onClick={() => setReviewStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  reviewStatusFilter === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                Approved ({comments.filter((c) => c.status === 'approved').length})
              </button>
              <button
                onClick={() => setReviewStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  reviewStatusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                Rejected ({comments.filter((c) => c.status === 'rejected').length})
              </button>
              <button
                onClick={() => setReviewStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  reviewStatusFilter === 'all'
                    ? 'bg-stone-700 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                All
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-12 text-center">
                <MessageSquare className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                <p className="text-xs text-stone-400 font-medium">No customer reviews in this category.</p>
              </div>
            ) : (
              filteredComments.map((rev) => {
                const product = products.find((p) => p.id === rev.productId);

                return (
                  <div
                    key={rev.id}
                    className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center font-bold text-amber-400 text-xs">
                          {rev.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-200 text-xs">{rev.customerName}</div>
                          <div className="text-[10px] text-stone-500">
                            {new Date(rev.createdAt).toLocaleString()} &bull;{' '}
                            <span className="text-stone-400 font-medium">{product?.title || 'Product Item'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                          rev.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : rev.status === 'rejected'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        Status: {rev.status}
                      </span>

                      <div className="flex items-center space-x-2">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                            className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                            className="bg-stone-800 hover:bg-red-950 hover:text-red-400 text-stone-300 px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-stone-500 hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Questions SubTab */
        <div className="space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl text-xs text-stone-400">
            <span>Customer inquiries submitted directly on product detail pages. Answers appear live for all shoppers.</span>
          </div>

          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-12 text-center">
                <HelpCircle className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                <p className="text-xs text-stone-400 font-medium">No product questions submitted yet.</p>
              </div>
            ) : (
              questions.map((q) => {
                const product = products.find((p) => p.id === q.productId);

                return (
                  <div
                    key={q.id}
                    className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-stone-200">{q.authorName || q.customerName || 'Customer'}</span>
                        <span className="text-[10px] text-stone-500">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-amber-400 text-[11px] font-medium">
                        Product: {product?.title || 'Boutique Item'}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-stone-200">
                      <span className="text-amber-400 font-bold mr-1">Q:</span> {q.question}
                    </div>

                    {q.answer ? (
                      <div className="p-3 bg-stone-900 rounded-xl border border-emerald-800/40 text-emerald-300">
                        <span className="font-bold text-emerald-400 block mb-0.5">Boutique Response:</span>
                        <span>{q.answer}</span>
                      </div>
                    ) : (
                      answeringQuestionId === q.id ? (
                        <div className="space-y-2 pt-2">
                          <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            rows={2}
                            placeholder="Write store response..."
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setAnsweringQuestionId(null)}
                              className="px-3 py-1 text-stone-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAnswerQuestion(q.id)}
                              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-1.5 rounded-lg text-xs"
                            >
                              Publish Answer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAnsweringQuestionId(q.id);
                            setAnswerText('');
                          }}
                          className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold px-3 py-1.5 rounded-xl text-xs"
                        >
                          Respond to Question
                        </button>
                      )
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
