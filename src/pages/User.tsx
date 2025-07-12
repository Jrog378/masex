import { Crud, type DataModel, type DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { useParams } from 'react-router-dom';
import { CreateUser, DeleteUser, getAllUsers, UpdateUser } from '../service/service';
import type { Base } from '../service/Utils';

export interface User extends DataModel {
    id: number;
    base: Base;
    first_name: string;
    last_name: string;
    role: "Admin" | "Viewer" | "";
}

let notesStore: User[];

export const notesDataSource: DataSource<User> = {
    fields: [
        { field: 'id', headerName: 'ID' },
        { field: 'first_name', headerName: 'First Name', flex: 2 },
        { field: 'last_name', headerName: 'Last Name', flex: 2 },
        {
            field: 'role', headerName: 'Role', type: 'singleSelect', flex: 2, valueOptions: [
                { value: 'admin', label: 'Admin' },
                { value: 'viewer', label: 'Viewer' },
            ],
        },
    ],

    getMany: async ({ paginationModel, filterModel, sortModel }) => {
        let processedNotes: User[] = notesStore; // Initialize with current notesStore
        await getAllUsers()
            .then((data) => {
                console.log(data)
                notesStore = data.map((user: any) => ({
                    id: user.base.id,
                    base: {id: user.base.id},
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                }));
                processedNotes = [...notesStore]; // Update processedNotes after notesStore
            })
            .catch((err) => {
                console.error('Error fetching users:', err);
            });


        // Apply filters (demo only)
        if (filterModel?.items?.length) {
            filterModel.items.forEach(({ field, value, operator }) => {
                if (!field || value == null) {
                    return;
                }

                processedNotes = processedNotes.filter((note) => {
                    const noteValue = note[field];

                    switch (operator) {
                        case 'contains':
                            return String(noteValue)
                                .toLowerCase()
                                .includes(String(value).toLowerCase());
                        case 'equals':
                            return noteValue === value;
                        case 'startsWith':
                            return String(noteValue)
                                .toLowerCase()
                                .startsWith(String(value).toLowerCase());
                        case 'endsWith':
                            return String(noteValue)
                                .toLowerCase()
                                .endsWith(String(value).toLowerCase());
                        case '>':
                            return (noteValue as number) > value;
                        case '<':
                            return (noteValue as number) < value;
                        default:
                            return true;
                    }
                });
            });
        }

        // Apply sorting
        if (sortModel?.length) {
            processedNotes.sort((a, b) => {
                for (const { field, sort } of sortModel) {
                    if ((a[field] as number) < (b[field] as number)) {
                        return sort === 'asc' ? -1 : 1;
                    }
                    if ((a[field] as number) > (b[field] as number)) {
                        return sort === 'asc' ? 1 : -1;
                    }
                }
                return 0;
            });
        }

        // Apply pagination
        const start = paginationModel.page * paginationModel.pageSize;
        const end = start + paginationModel.pageSize;
        const paginatedNotes = processedNotes.slice(start, end);

        return {
            items: paginatedNotes,
            itemCount: processedNotes.length,
        };
    },

    getOne: async (noteId) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        const noteToShow = notesStore.find((note) => note.id === Number(noteId));

        if (!noteToShow) {
            throw new Error('Note not found');
        }
        return noteToShow;
    },

    createOne: async (data) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        const newNote: User = {
            ...data,
        } as User;

        console.log(newNote)

        await CreateUser(newNote)
            .catch((err) => {
                console.error('Error fetching users:', err);
            });

        notesStore = [...notesStore, newNote];

        return newNote;
    },

    updateOne: async (noteId, data) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        let updatedNote: User | null = null;

        notesStore = notesStore.map((note) => {
            if (note.id === Number(noteId)) {
                updatedNote = { ...note, ...data };
                return updatedNote;
            }

            return note;
        });

        if (!updatedNote) {
            throw new Error('Note not found');
        }

        await UpdateUser(updatedNote, String(noteId))
            .catch((err) => {
                console.error('Error fetching users:', err);
            });

        return updatedNote;
    },

    deleteOne: async (noteId) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        notesStore = notesStore.filter((note) => note.id !== Number(noteId));

        await DeleteUser(String(noteId))
            .catch((err) => {
                console.error('Error fetching users:', err);
            });
    },

    validate: (formValues) => {
        let issues: { message: string; path: [keyof User] }[] = [];

        if (!formValues.first_name) {
            issues = [...issues, { message: 'First Name is required', path: ['first_name'] }];
        }

        if (formValues.first_name && formValues.first_name.length < 3) {
            issues = [
                ...issues,
                {
                    message: 'First Name must be at least 3 characters long',
                    path: ['first_name'],
                },
            ];
        }

        if (!formValues.last_name) {
            issues = [...issues, { message: 'Last Name is required', path: ['last_name'] }];
        }

        return { issues };
    },
};

const notesCache = new DataSourceCache();

export default function User() {
    const { noteId } = useParams();

    return (

        <div style={{ width: '100%' }}>
            <Crud<User>
                dataSource={notesDataSource}
                dataSourceCache={notesCache}
                rootPath="/user"
                initialPageSize={25}
                // defaultValues={{ first_name: 'New User' }}
                pageTitles={{
                    create: 'New User',
                    edit: `User ${noteId} - Edit`,
                    show: `User ${noteId}`,
                }}
            />
        </div>


    );
}
