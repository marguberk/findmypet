import { v4 as uuidv4 } from 'uuid';

// Функция для получения комментариев из localStorage
const getStoredComments = () => {
  const comments = localStorage.getItem('petComments');
  return comments ? JSON.parse(comments) : {};
};

// Функция для сохранения комментариев в localStorage
const saveComments = (comments) => {
  localStorage.setItem('petComments', JSON.stringify(comments));
};

// Получить все комментарии для конкретного поста
export const getCommentsByPetId = async (petId) => {
  try {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allComments = getStoredComments();
    const petComments = allComments[petId] || [];
    
    return { success: true, data: petComments };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error: 'Failed to fetch comments' };
  }
};

// Добавить новый комментарий
export const addComment = async (petId, commentData) => {
  try {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allComments = getStoredComments();
    const petComments = allComments[petId] || [];
    
    // Создание нового комментария
    const newComment = {
      id: uuidv4(),
      petId,
      text: commentData.text,
      userId: commentData.userId,
      userName: commentData.userName,
      createdAt: new Date().toISOString(),
      ...commentData
    };
    
    // Добавление комментария в начало списка
    petComments.unshift(newComment);
    
    // Сохранение всех комментариев
    allComments[petId] = petComments;
    saveComments(allComments);
    
    return { success: true, data: newComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: 'Failed to add comment' };
  }
};

// Удалить комментарий
export const deleteComment = async (petId, commentId) => {
  try {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allComments = getStoredComments();
    const petComments = allComments[petId] || [];
    
    // Фильтрация комментариев для удаления указанного
    const updatedComments = petComments.filter(comment => comment.id !== commentId);
    
    // Сохранение обновленных комментариев
    allComments[petId] = updatedComments;
    saveComments(allComments);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: 'Failed to delete comment' };
  }
}; 