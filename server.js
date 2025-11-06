const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static(__dirname));

// Store rooms and their players
const rooms = new Map();

// Store pending room deletions (for host reconnection grace period)
const pendingDeletions = new Map();

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Host creates a room
    socket.on('createRoom', ({ roomCode, hostName }) => {
        console.log(`Host ${hostName} creating room ${roomCode}`);

        socket.join(roomCode);

        // Check if room already exists (host reconnection scenario)
        const existingRoom = rooms.get(roomCode);

        if (existingRoom) {
            // Room exists - host is reconnecting, update their socket ID
            console.log(`Host ${hostName} reconnecting to existing room ${roomCode} - updating socket ID`);
            existingRoom.host = socket.id;

            // Update host's player entry
            const hostPlayerIndex = existingRoom.players.findIndex(p => p.name === hostName);
            if (hostPlayerIndex !== -1) {
                existingRoom.players[hostPlayerIndex].id = socket.id;
            }

            // Cancel pending room deletion if host reconnected in time
            if (pendingDeletions.has(roomCode)) {
                clearTimeout(pendingDeletions.get(roomCode));
                pendingDeletions.delete(roomCode);
                console.log(`Host reconnected in time - cancelled room ${roomCode} deletion`);
            }

            socket.emit('roomCreated', { success: true, roomCode });
        } else {
            // Create new room
            rooms.set(roomCode, {
                host: socket.id,
                players: [{
                    id: socket.id,
                    name: hostName
                }]
            });

            socket.emit('roomCreated', { success: true, roomCode });
            console.log(`New room ${roomCode} created by host ${hostName}`);
        }
    });

    // Player joins a room
    socket.on('joinRoom', ({ roomCode, playerName }) => {
        console.log(`Player ${playerName} joining room ${roomCode}`);

        const room = rooms.get(roomCode);

        if (!room) {
            socket.emit('joinError', { message: 'Room not found' });
            return;
        }

        socket.join(roomCode);

        // Check if player with this name already exists (reconnection scenario)
        const existingPlayerIndex = room.players.findIndex(p => p.name === playerName);

        if (existingPlayerIndex !== -1) {
            // Player reconnecting - update their socket ID
            console.log(`Player ${playerName} reconnecting - updating socket ID from ${room.players[existingPlayerIndex].id} to ${socket.id}`);
            room.players[existingPlayerIndex].id = socket.id;
        } else {
            // New player - add to room
            room.players.push({
                id: socket.id,
                name: playerName
            });
            console.log(`New player ${playerName} added to room ${roomCode}`);
        }

        // Notify player they joined successfully
        socket.emit('joinedRoom', {
            success: true,
            roomCode,
            players: room.players
        });

        // Notify host and all other players
        socket.to(roomCode).emit('playerJoined', {
            playerId: socket.id,
            playerName: playerName,
            players: room.players
        });

        console.log(`Room ${roomCode} now has ${room.players.length} players`);
    });

    // Broadcast game data to all players in room
    socket.on('broadcast', ({ roomCode, data, excludeIds }) => {
        const exclude = excludeIds || [];

        // Send to all players in room except excluded ones
        const socketsInRoom = io.sockets.adapter.rooms.get(roomCode);
        if (socketsInRoom) {
            socketsInRoom.forEach(socketId => {
                if (socketId !== socket.id && !exclude.includes(socketId)) {
                    io.to(socketId).emit('gameData', data);
                }
            });
        }
    });

    // Send data to specific player
    socket.on('sendToPlayer', ({ playerId, data }) => {
        io.to(playerId).emit('gameData', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // Find and update room
        rooms.forEach((room, roomCode) => {
            const playerIndex = room.players.findIndex(p => p.id === socket.id);

            if (playerIndex !== -1) {
                const playerName = room.players[playerIndex].name;
                room.players.splice(playerIndex, 1);

                // If host disconnected, give them 5 seconds to reconnect before deleting room
                if (socket.id === room.host) {
                    console.log(`Host disconnected from room ${roomCode} - starting 5 second grace period`);

                    // Set a timer to delete the room after 5 seconds
                    const deletionTimer = setTimeout(() => {
                        io.to(roomCode).emit('hostDisconnected');
                        rooms.delete(roomCode);
                        pendingDeletions.delete(roomCode);
                        console.log(`Room ${roomCode} deleted - host did not reconnect`);
                    }, 5000);

                    // Store the timer so we can cancel it if host reconnects
                    pendingDeletions.set(roomCode, deletionTimer);
                } else {
                    // Notify remaining players
                    io.to(roomCode).emit('playerLeft', {
                        playerId: socket.id,
                        playerName: playerName,
                        players: room.players
                    });
                    console.log(`Player ${playerName} left room ${roomCode}`);
                }
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
