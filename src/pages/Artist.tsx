import { Crud, type DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { useParams } from 'react-router-dom';
import { CreateArtist, DeleteArtist, getAllArtist, UpdateArtist } from '../service/service';
import type { Artist } from '../service/Utils';
import { TextField } from '@mui/material';

let notesStore: Artist[];

export const notesDataSource: DataSource<Artist> = {
    fields: [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'first_name', headerName: 'First Name', flex: 2 },
        { field: 'last_name', headerName: 'Last Name', flex: 2 },
        {
            field: 'bio',
            headerName: 'Biography',
            flex: 2,
            renderFormField: ({ value, onChange, error }) => (
                <TextField
                    style={{ width: '100%' }}
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                    error={!!error}
                    helperText={error}
                    multiline
                    minRows={3}
                    fullWidth
                    variant="outlined"
                />
            ),
        },
    ],

    getMany: async ({ paginationModel, filterModel, sortModel }) => {
        let processedNotes: Artist[] = notesStore; // Initialize with current notesStore
        await getAllArtist()
            .then((data) => {
                console.log(data)
                notesStore = data.map((art: any) => ({
                    id: art.base.id,
                    base: { id: art.base.id },
                    first_name: art.first_name,
                    last_name: art.last_name,
                    bio: art.bio
                }));
                processedNotes = [...notesStore]; // Update processedNotes after notesStore
            })
            .catch((err) => {
                console.error('Error fetching Artist:', err);
            });
        // console.log(notesStore)


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

        const newNote: Artist = {
            ...data,
        } as Artist;

        // console.log(newNote)

        await CreateArtist(newNote)
            .catch((err) => {
                console.error('Error fetching Artist:', err);
            });

        notesStore = [...notesStore, newNote];

        return newNote;
    },

    updateOne: async (noteId, data) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        let updatedNote: Artist | null = null;

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

        // console.log(updatedNote)

        await UpdateArtist(updatedNote, String(noteId))
            .catch((err) => {
                console.error('Error fetching Artist:', err);
            });

        return updatedNote;
    },

    deleteOne: async (noteId) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        notesStore = notesStore.filter((note) => note.id !== Number(noteId));

        await DeleteArtist(String(noteId))
            .catch((err) => {
                console.error('Error fetching Artist:', err);
            });
    },

    validate: (formValues) => {
        let issues: { message: string; path: [keyof Artist] }[] = [];

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

export default function Artist() {
    const { noteId } = useParams();

    return (

        <div style={{ width: '100%' }}>
            <Crud<Artist>
                dataSource={notesDataSource}
                dataSourceCache={notesCache}
                rootPath="/catalog/artist"
                initialPageSize={25}
                // defaultValues={{ first_name: 'New Artist' }}
                pageTitles={{
                    create: 'New Artist',
                    edit: `Artist ${noteId} - Edit`,
                    show: `Artist ${noteId}`,
                }}
            />
        </div>


    );
}
