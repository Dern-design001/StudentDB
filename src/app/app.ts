import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Student {
  id: number;
  name: string;
  rollNo: string;
  department: string;
  email: string;
  timestamp: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      <!-- Sidebar / Navigation -->
      <nav class="fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50 md:sticky md:top-0 md:bottom-auto md:flex-col md:w-24 md:h-screen md:border-t-0 md:border-r">
        <div class="hidden md:flex items-center justify-center mb-8 mt-6 bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        
        <div class="flex md:flex-col gap-6 md:gap-8">
          <button 
            (click)="setView('home')"
            [class]="'flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ' + (view() === 'home' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-widest">Home</span>
          </button>

          <button 
            (click)="setView('dashboard')"
            [class]="'flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ' + (view() === 'dashboard' ? 'text-indigo-600 bg-indigo-50 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span class="text-[10px] font-bold uppercase tracking-widest">Records</span>
          </button>
        </div>
        <div class="hidden md:block mt-auto mb-6 text-slate-300 text-[10px] font-bold rotate-180 [writing-mode:vertical-lr]">
          v1.2 CENTRIC
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col items-center justify-center p-6 md:p-12 mb-20 md:mb-0">
        
        <!-- VIEW: HOME (INPUT) -->
        <div *ngIf="view() === 'home'" class="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
          <header class="mb-10 text-center">
            <div class="inline-flex md:hidden bg-indigo-600 p-3 rounded-2xl text-white shadow-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <h1 class="text-4xl font-black text-slate-800 tracking-tight mb-3">Student Registration</h1>
            <p class="text-slate-500 text-lg">Enter the details below to enroll a new student.</p>
          </header>

          <div class="w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <form (submit)="handleSubmit($event)" class="space-y-8">
              <div>
                <label class="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div class="relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input
                    type="text"
                    [value]="name()"
                    (input)="updateState('name', $event)"
                    placeholder="e.g. Alexander Hamilton"
                    class="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-3xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.2em] ml-1">Roll Number</label>
                <div class="relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
                  <input
                    type="text"
                    [value]="rollNo()"
                    (input)="updateState('rollNo', $event)"
                    placeholder="e.g. 2024-CS-101"
                    class="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-3xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.2em] ml-1">Department</label>
                  <div class="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M9 22V12h6v10"/><path d="M2 9l10-7 10 7"/></svg>
                    <input
                      type="text"
                      [value]="department()"
                      (input)="updateState('department', $event)"
                      placeholder="e.g. Computer Science"
                      class="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-3xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div class="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <input
                      type="email"
                      [value]="email()"
                      (input)="updateState('email', $event)"
                      placeholder="e.g. alex@university.edu"
                      class="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-slate-100 rounded-3xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
                    />
                  </div>
                </div>
              </div>

              <div *ngIf="error()" class="flex items-center gap-3 text-red-600 bg-red-50 p-5 rounded-3xl text-sm font-semibold border border-red-100 animate-in slide-in-from-top-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {{ error() }}
              </div>

              <div *ngIf="success()" class="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-5 rounded-3xl text-sm font-semibold border border-emerald-100 animate-in slide-in-from-top-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                Registration completed successfully!
              </div>

              <button
                type="submit"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-3xl shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                Register Now
              </button>
            </form>

            <div class="mt-10 pt-8 border-t border-slate-50 text-center">
              <button 
                (click)="setView('dashboard')"
                class="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                Go to Dashboard
                <span class="ml-2 bg-white px-2 py-0.5 rounded-lg text-xs shadow-sm border border-slate-100 group-hover:border-indigo-100">
                  {{ students().length }} entries
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- VIEW: DASHBOARD (ENTRIES) -->
        <div *ngIf="view() === 'dashboard'" class="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div class="text-center md:text-left">
              <h1 class="text-4xl font-black text-slate-800 tracking-tight">Records Database</h1>
              <p class="text-slate-500 mt-2 font-medium">Currently managing {{ students().length }} registered students.</p>
            </div>
            
            <div class="relative group min-w-[320px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                placeholder="Quick search records..."
                [value]="searchTerm()"
                (input)="updateState('searchTerm', $event)"
                class="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div *ngIf="filteredStudents().length > 0; else emptyState" class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/50">
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Student Profile</th>
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Department</th>
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Identifier</th>
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] hidden md:table-cell text-center">Enrolled</th>
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr *ngFor="let student of filteredStudents()" class="hover:bg-indigo-50/30 transition-colors group">
                    <td class="px-10 py-6">
                      <div class="flex items-center gap-5">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                          {{ student.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="font-bold text-slate-800 text-lg leading-tight">{{ student.name }}</div>
                          <div class="text-[11px] text-slate-400 font-bold tracking-wider mt-1">{{ student.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-10 py-6">
                      <span class="text-sm font-bold text-slate-600">{{ student.department }}</span>
                    </td>
                    <td class="px-10 py-6">
                      <span class="px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-mono font-black border border-slate-200 shadow-sm">
                        {{ student.rollNo }}
                      </span>
                    </td>
                    <td class="px-10 py-6 text-sm text-slate-400 font-bold hidden md:table-cell text-center">
                      {{ student.timestamp.split(',')[0] }}
                    </td>
                    <td class="px-10 py-6 text-right">
                      <button
                        (click)="deleteStudent(student.id)"
                        class="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-[1.25rem] transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <ng-template #emptyState>
              <div class="p-24 text-center">
                <div class="relative inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-[2rem] mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 text-slate-200"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <div class="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full animate-ping"></div>
                </div>
                <h3 class="text-2xl font-black text-slate-800">No matching entries</h3>
                <p class="text-slate-400 max-w-sm mx-auto mt-3 font-medium text-lg leading-relaxed">
                  {{ searchTerm() ? "The search yielded no results. Try another name or roll number." : "The database is currently empty. Head back home to add some records." }}
                </p>
                <button 
                  *ngIf="!searchTerm()"
                  (click)="setView('home')"
                  class="mt-10 inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Register First Student
                </button>
              </div>
            </ng-template>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-in {
      animation: enter 0.5s ease-out;
    }
    @keyframes enter {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class App {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/students';

  view = signal<'home' | 'dashboard'>('home');
  students = signal<Student[]>([]);
  name = signal('');
  rollNo = signal('');
  department = signal('');
  email = signal('');
  searchTerm = signal('');
  error = signal('');
  success = signal(false);

  constructor() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<Student[]>(this.apiUrl).subscribe({
      next: (data) => this.students.set(data),
      error: (err) => console.error('Fetch error:', err)
    });
  }

  filteredStudents = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.students().filter(s => 
      s.name.toLowerCase().includes(term) ||
      s.rollNo.includes(term)
    );
  });

  setView(newView: 'home' | 'dashboard') {
    this.view.set(newView);
    if (newView === 'dashboard') this.fetchStudents();
  }

  updateState(field: 'name' | 'rollNo' | 'searchTerm' | 'department' | 'email', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'name') this.name.set(value);
    if (field === 'rollNo') this.rollNo.set(value);
    if (field === 'department') this.department.set(value);
    if (field === 'email') this.email.set(value);
    if (field === 'searchTerm') this.searchTerm.set(value);
    this.success.set(false);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.error.set('');
    this.success.set(false);

    const n = this.name().trim();
    const r = this.rollNo().trim();
    const d = this.department().trim();
    const e = this.email().trim();

    if (!n || !r || !d || !e) {
      this.error.set('All fields (Name, Roll, Dept, Email) are required.');
      return;
    }

    if (this.students().some(s => s.rollNo === r)) {
      this.error.set('This Roll Number is already registered.');
      return;
    }

    const newStudent: Omit<Student, 'id'> & { id: number } = {
      id: Date.now(),
      name: n,
      rollNo: r,
      department: d,
      email: e,
      timestamp: new Date().toLocaleString()
    };

    this.http.post<Student>(this.apiUrl, newStudent).subscribe({
      next: (savedStudent) => {
        this.students.set([savedStudent, ...this.students()]);
        this.name.set('');
        this.rollNo.set('');
        this.department.set('');
        this.email.set('');
        this.success.set(true);
      },
      error: (err) => this.error.set('Database error: ' + err.message)
    });
  }

  deleteStudent(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.students.set(this.students().filter(s => s.id !== id));
      },
      error: (err) => console.error('Delete error:', err)
    });
  }
}
