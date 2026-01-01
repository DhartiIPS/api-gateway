#!/bin/bash

# BFF Gateway Startup Script
# This script starts all services in the correct order

echo "🚀 Starting Doctor Appointment Booking System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "${YELLOW}Checking PostgreSQL...${NC}"
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "${RED}❌ PostgreSQL is not running on localhost:5432${NC}"
    echo "Please start PostgreSQL and try again"
    exit 1
fi
echo "${GREEN}✅ PostgreSQL is running${NC}"   
echo ""

# Start Auth Service
echo "${YELLOW}Starting Auth Service...${NC}"
cd ../auth-service
npm run start:dev &
AUTH_PID=$!
echo "${GREEN}✅ Auth Service started (PID: $AUTH_PID)${NC}"
sleep 3
echo ""

# Start Appointment Service
echo "${YELLOW}Starting Appointment Service...${NC}"
cd ../appointment-service
npm run start:dev &
APPOINTMENT_PID=$!
echo "${GREEN}✅ Appointment Service started (PID: $APPOINTMENT_PID)${NC}"
sleep 3
echo ""

# Start BFF Gateway
echo "${YELLOW}Starting BFF Gateway...${NC}"
cd ../gateway
npm run start:dev &
GATEWAY_PID=$!
echo "${GREEN}✅ BFF Gateway started (PID: $GATEWAY_PID)${NC}"
echo ""

# Start Frontend
echo "${YELLOW}Starting Frontend...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

echo "${GREEN}========================================${NC}"
echo "${GREEN}🎉 All services started successfully!${NC}"
echo "${GREEN}========================================${NC}"
echo ""
echo "Service URLs:"
echo "  📱 Frontend:            http://localhost:3000"
echo "  🔌 BFF Gateway:         http://localhost:3001"
echo "  🔧 Auth Service:        TCP 127.0.0.1:5002"
echo "  🔧 Appointment Service: TCP 127.0.0.1:5003"
echo "  🗄️  PostgreSQL:          localhost:5432"
echo ""
echo "Process IDs:"
echo "  Auth Service:           $AUTH_PID"
echo "  Appointment Service:    $APPOINTMENT_PID"
echo "  BFF Gateway:            $GATEWAY_PID"
echo "  Frontend:               $FRONTEND_PID"
echo ""
echo "${YELLOW}To stop all services, run: kill $AUTH_PID $APPOINTMENT_PID $GATEWAY_PID $FRONTEND_PID${NC}"
echo ""

# Wait for all background processes
wait
