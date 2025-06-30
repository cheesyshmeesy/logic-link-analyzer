
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ResultFeedbackProps {
  onFeedback: (rating: 'positive' | 'negative', comment?: string) => void;
  disabled?: boolean;
}

const ResultFeedback: React.FC<ResultFeedbackProps> = ({ onFeedback, disabled = false }) => {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePositiveFeedback = () => {
    onFeedback('positive');
    setSubmitted(true);
  };

  const handleNegativeFeedback = () => {
    setShowCommentDialog(true);
  };

  const handleSubmitComment = () => {
    onFeedback('negative', comment);
    setShowCommentDialog(false);
    setSubmitted(true);
    setComment('');
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2 text-green-700">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Спасибо за обратную связь!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700 font-medium">Оцените результат:</p>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePositiveFeedback}
            disabled={disabled}
            className="text-green-600 hover:text-green-800 hover:bg-green-50 disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Полезно
          </Button>
          
          <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNegativeFeedback}
                disabled={disabled}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50"
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                Неточно
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Что можно улучшить?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Опишите, что было неточно или что можно улучшить..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCommentDialog(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!comment.trim()}
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ResultFeedback;
