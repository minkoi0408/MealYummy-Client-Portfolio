import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Circle, Trophy, Loader2 } from 'lucide-react';
import { useBrightness } from '../../contexts/brightness-context';
import { challengeApi, type ChallengeOverview, type CheckMealRequest } from '../../../apis/challenge.api';

export function ChallengeTab() {
  const { isBright } = useBrightness();
  const [overview, setOverview] = useState<ChallengeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await challengeApi.getTodayOverview();
      setOverview(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMeal = async (mealType: CheckMealRequest['mealType'], currentStatus: boolean) => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await challengeApi.checkMeal({ mealType, status: !currentStatus });
      setOverview(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  const meals = [
    { type: 'BREAKFAST', label: 'Bữa sáng', done: overview?.breakfastDone || false, icon: '🌅' },
    { type: 'LUNCH', label: 'Bữa trưa', done: overview?.lunchDone || false, icon: '☀️' },
    { type: 'DINNER', label: 'Bữa tối', done: overview?.dinnerDone || false, icon: '🌙' },
    { type: 'SNACK', label: 'Bữa phụ (Không bắt buộc)', done: overview?.snackDone || false, icon: '🍎', optional: true }
  ];

  const mainCompleted = overview?.isTodayCompleted;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Streak Banner */}
      <div className={`p-6 rounded-3xl ${isBright ? 'bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-100' : 'bg-gradient-to-r from-orange-950/30 to-rose-950/30 border border-orange-900/50'} flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Flame className={`w-16 h-16 ${mainCompleted ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Streak
            </div>
          </div>
          <div>
            <h2 className={`text-3xl font-black ${isBright ? 'text-gray-900' : 'text-white'}`}>
              {overview?.currentStreak || 0} ngày
            </h2>
            <p className={`text-sm font-medium ${isBright ? 'text-orange-600' : 'text-orange-400'}`}>
              {mainCompleted ? "Tuyệt vời! Bạn đã hoàn thành thử thách hôm nay." : "Hoàn thành 3 bữa chính để giữ streak nhé!"}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <Trophy className="w-4 h-4 text-yellow-500" /> Kỷ lục: {overview?.highestStreak || 0} ngày
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isBright ? 'text-gray-900' : 'text-white'}`}>
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          Nhiệm vụ hôm nay
        </h3>
        
        <div className="grid gap-3">
          {meals.map((meal) => (
            <button
              key={meal.type}
              disabled={updating}
              onClick={() => handleCheckMeal(meal.type as any, meal.done)}
              className={`flex items-center p-4 rounded-2xl transition-all duration-300 text-left w-full ${
                meal.done 
                  ? (isBright ? 'bg-green-50 border-2 border-green-200' : 'bg-green-950/30 border-2 border-green-900/50') 
                  : (isBright ? 'bg-white border-2 border-gray-100 hover:border-green-200' : 'bg-[#1c1c1c] border-2 border-gray-800 hover:border-green-900/50')
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl mr-4 ${isBright ? 'bg-white shadow-sm' : 'bg-black/20'}`}>
                {meal.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${meal.done ? (isBright ? 'text-green-800' : 'text-green-400') : (isBright ? 'text-gray-800' : 'text-gray-200')}`}>
                  {meal.label}
                </h4>
                {meal.optional && <p className="text-xs text-gray-500">Không bắt buộc cho chuỗi ngày</p>}
              </div>
              <div className="ml-4">
                {meal.done ? (
                  <CheckCircle2 className={`w-8 h-8 ${isBright ? 'text-green-500' : 'text-green-400'}`} />
                ) : (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
