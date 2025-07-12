import { Crud, type DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { useParams } from 'react-router-dom';
import { CreateArtwork, DeleteArtwork, getAllArtist, getAllArtwork, getAllDonor, UpdateArtwork } from '../service/service';
import { type Artist, type Artwork, type Donor } from '../service/Utils';

let notesStore: Artwork[];

const artists = await getAllArtist()
const donors = await getAllDonor()

export const notesDataSource: DataSource<Artwork> = {
    fields: [
        { field: 'id', headerName: 'ID', flex: 1 },
        // { field: 'a_first_name', headerName: 'First Name', flex: 2 },
        // { field: 'a_last_name', headerName: 'Last Name', flex: 2 },
        { field: 'title', headerName: 'Title', flex: 2 },
        { field: 'medium', headerName: 'Medium', flex: 2 },
        { field: 'art_height', headerName: 'Height', flex: 1 },
        { field: 'art_width', headerName: 'Width', flex: 1 },
        { field: 'art_depth', headerName: 'Depth', flex: 1 },
        {
            field: 'artist',
            headerName: 'Artist',
            type: 'singleSelect',
            valueFormatter: (value: Artist) => {
                return (value.first_name || value.last_name) ? value.first_name + " " + value.last_name : "NA";
            },
            valueOptions: artists.map((artist) => (
                { value: artist, label: artist.first_name + " " + artist.last_name }
            )),
            flex: 2,
        },
        {
            field: 'donor',
            headerName: 'Donor',
            type: 'singleSelect',
            valueFormatter: (value: Donor) => {
                return (value.first_name || value.last_name) ? value.first_name + " " + value.last_name : "NA";
            },
            valueOptions: donors.map((donor) => (
                { value: donor, label: donor.first_name + " " + donor.last_name }
            )),
            flex: 2,
        },
        { field: 'url', headerName: 'Image Url', flex: 2 },
    ],

    getMany: async ({ paginationModel, filterModel, sortModel }) => {
        let processedNotes: Artwork[] = notesStore; // Initialize with current notesStore
        await getAllArtwork()
            .then((data) => {
                notesStore = data.map((art: any) => ({
                    id: art.base.id,
                    base: { id: art.base.id },
                    artist: art.artist,
                    donor: art.donor,
                    title: art.title,
                    medium: art.medium,
                    art_height: art.art_height,
                    art_width: art.art_width,
                    art_depth: art.art_depth,
                    url: art.url,
                    year: art.art_height
                }));
                processedNotes = [...notesStore]; // Update processedNotes after notesStore
            })
            .catch((err) => {
                console.error('Error fetching artwork:', err);
            });
        console.log(notesStore)


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

        const newNote: Artwork = {
            ...data,
        } as Artwork;

        console.log(newNote)

        await CreateArtwork(newNote)
            .catch((err) => {
                console.error('Error fetching artwork:', err);
            });

        notesStore = [...notesStore, newNote];

        return newNote;
    },

    updateOne: async (noteId, data) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        let updatedNote: Artwork | null = null;

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

        console.log(updatedNote)

        await UpdateArtwork(updatedNote, String(noteId))
            .catch((err) => {
                console.error('Error fetching artwork:', err);
            });

        return updatedNote;
    },

    deleteOne: async (noteId) => {
        // Simulate loading delay
        await new Promise((resolve) => {
            setTimeout(resolve, 750);
        });

        notesStore = notesStore.filter((note) => note.id !== Number(noteId));

        await DeleteArtwork(String(noteId))
            .catch((err) => {
                console.error('Error fetching artwork:', err);
            });
    },

    validate: (formValues) => {
        let issues: { message: string; path: [keyof Artwork] }[] = [];

        if (!formValues.title) {
            issues = [...issues, { message: 'Title is required', path: ['title'] }];
        }

        if (formValues.title && formValues.title.length < 3) {
            issues = [
                ...issues,
                {
                    message: 'Title must be at least 3 characters long',
                    path: ['title'],
                },
            ];
        }

        if (!formValues.medium) {
            issues = [...issues, { message: 'Medium is required', path: ['medium'] }];
        }

        return { issues };
    },
};

const notesCache = new DataSourceCache();

export default function Artwork() {
    const { noteId } = useParams();

    return (

        <div style={{ width: '100%' }}>
            <Crud<Artwork>
                dataSource={notesDataSource}
                dataSourceCache={notesCache}
                rootPath="/catalog/artwork"
                initialPageSize={25}
                // defaultValues={{ first_name: 'New Artwork' }}
                pageTitles={{
                    create: 'New Artwork',
                    edit: `Artwork ${noteId} - Edit`,
                    show: `Artwork ${noteId}`,
                }}
            />
        </div>


    );
}
