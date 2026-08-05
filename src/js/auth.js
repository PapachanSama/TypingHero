/**
 * Student Authentication & Profile Session Management
 */

import { getStoredStudents, saveStudent } from './firebase.js';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.studentsList = [];
  }

  async init() {
    this.studentsList = await getStoredStudents();
    const savedUserId = localStorage.getItem('typing_hero_active_user');
    if (savedUserId) {
      this.currentUser = this.studentsList.find(s => s.id === savedUserId) || this.studentsList[0];
    } else {
      this.currentUser = this.studentsList[0];
    }
  }

  getCurrentUser() {
    return this.currentUser || { name: 'ゲスト生徒', role: 'student', id: 'std_default' };
  }

  async login(name, pin) {
    this.studentsList = await getStoredStudents();
    const target = this.studentsList.find(s => s.name.trim() === name.trim());
    if (!target) {
      // Auto register student if new name
      const newUser = {
        id: 'std_' + Date.now(),
        name: name.trim(),
        pin: pin || '0000',
        role: name.includes('先生') ? 'admin' : 'student',
        createdAt: Date.now()
      };
      await saveStudent(newUser);
      this.currentUser = newUser;
      localStorage.setItem('typing_hero_active_user', newUser.id);
      return { success: true, user: newUser, isNew: true };
    }

    if (target.pin && target.pin !== pin) {
      return { success: false, message: 'PINコードが正しくありません。' };
    }

    this.currentUser = target;
    localStorage.setItem('typing_hero_active_user', target.id);
    return { success: true, user: target };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('typing_hero_active_user');
  }
}

export const auth = new AuthManager();
