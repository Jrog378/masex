import { getAllArtwork } from '../service/service';
import type { Artwork } from '../service/Utils';
import { useEffect, useState, } from 'react';
import { Card, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';

export default function Catalog() {
    const [art, setArt] = useState<Artwork[]>([])
    let artStore: Artwork[] = []

    useEffect(() => {
        getAllArtwork()
            .then((data) => {
                // console.log(data)
                artStore = data.map((art: any) => ({
                    id: art.base.id,
                    base: { id: art.base.id },
                    artist: art.Artist,
                    title: art.title,
                    medium: art.medium,
                    art_height: art.art_height,
                    art_width: art.art_width,
                    art_depth: art.art_depth,
                    year: art.year,
                    url: "https://pub-000ed53cb8584d58b07f37fa3bc45ab9.r2.dev/GreyComposition1.png",
                }));
                console.log(artStore)
                setArt(artStore)
            })
            .catch((err) => {
                console.error('Error fetching artwork:', err);
            });
    }, [])


    return (
        <div style={{ width: '100%' }}>
            <h1>Should Have Images</h1>
            <Grid container spacing={4}>
                {art.map((art) => (
                    <Grid size={4}>
                        <Card>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <CardContent sx={{ height: '100%' }}>
                                    <Typography variant="body1" component="div" fontWeight={"bold"}>
                                        {art.a_first_name + " " + art.a_last_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {art.title + ", " + art.year}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {art.medium}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {art.art_height + '" x ' + art.art_width + '" in'}
                                    </Typography>
                                </CardContent>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 151 }}
                                    image={art.url}
                                    alt="Live from space album cover"
                                />
                            </Stack>
                        </Card>
                    </Grid>
                ))}

            </Grid>
        </div>
    );
}
