import React, { useState } from 'react';
import { StarIcon } from './icons';

interface FeedbackFormProps {
    ticketTitle: string;
    onSubmit: (rating: number, comment: string) => void;
    onClose: () => void;
}

const StarRating: React.FC<{ rating: number; onRate: (rating: number) => void }> = ({ rating, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                    <StarIcon 
                        className={`h-9 w-9 transition-colors ${
                            (hoverRating || rating) >= star 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                    />
                </button>
            ))}
        </div>
    );
};


export const FeedbackForm: React.FC<FeedbackFormProps> = ({ ticketTitle, onSubmit, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please provide a rating.');
            return;
        }
        onSubmit(rating, comment);
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 m-4 w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback for "{ticketTitle}"</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none" aria-label="Close feedback form">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                                How satisfied are you with the resolution?
                            </label>
                            <StarRating rating={rating} onRate={setRating} />
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Additional Comments (Optional)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 resize-y"
                                placeholder="Tell us more about your experience..."
                            />
                        </div>
                    </div>
                    <div className="mt-7 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-base font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-base font-medium rounded-md shadow-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};