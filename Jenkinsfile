pipeline {
    agent any
    environment {
        GIT_CREDENTIALS_ID = '73afd83f-99cd-45c4-b6ca-15e5ec399dec'
        REPO_URL = 'https://github.com/Teemo4621/improf.git'
        BRANCH = 'main'
        BACKEND_IMAGE_NAME = 'improfapi'
        FRONTEND_IMAGE_NAME = 'improf'
        BACKEND_CONTAINER_NAME = 'improfapi'
        FRONTEND_CONTAINER_NAME = 'improf'
    }
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "*/${BRANCH}"]],
                        userRemoteConfigs: [[
                            url: REPO_URL,
                            credentialsId: GIT_CREDENTIALS_ID
                        ]]
                    ])
                }
            }
        }

        stage('Remove Old Backend Docker Image') {
            steps {
                script {
                    sh """
                    docker stop ${BACKEND_CONTAINER_NAME} || true
                    docker rm ${BACKEND_CONTAINER_NAME} || true
                    docker rmi -f ${BACKEND_IMAGE_NAME} || true
                    """
                }
            }
        }

        stage('Remove Old Frontend Docker Image') {
            steps {
                script {
                    sh """
                    docker stop ${FRONTEND_CONTAINER_NAME} || true
                    docker rm ${FRONTEND_CONTAINER_NAME} || true
                    docker rmi -f ${FRONTEND_IMAGE_NAME} || true
                    """
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE_NAME} ./backend"
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE_NAME} ./frontend"
                }
            }
        }

        stage('Stop and Remove Old Backend Container') {
            steps {
                script {
                    sh "docker stop ${BACKEND_CONTAINER_NAME} || true"
                    sh "docker rm ${BACKEND_CONTAINER_NAME} || true"
                }
            }
        }

        stage('Stop and Remove Old Frontend Container') {
            steps {
                script {
                    sh "docker stop ${FRONTEND_CONTAINER_NAME} || true"
                    sh "docker rm ${FRONTEND_CONTAINER_NAME} || true"
                }
            }
        }

        stage('Run Backend Container') {
            steps {
                script {
                    sh """
                    docker run -d --name ${BACKEND_CONTAINER_NAME} -p 3422:${env.PORT} \\
                    -v \$PWD/backend/uploads:/app/uploads \\
                    -e DATABASE_URL=${env.DATABASE_URL} \\
                    -e ACCESS_TOKENJWT_SECRET=${env.ACCESS_TOKENJWT_SECRET} \\
                    -e ACCESS_TOKEN_EXPIRATION=${env.ACCESS_TOKEN_EXPIRATION} \\
                    -e REFRESH_TOKENJWT_SECRET=${env.REFRESH_TOKENJWT_SECRET} \\
                    -e REFRESH_TOKEN_EXPIRATION=${env.REFRESH_TOKEN_EXPIRATION} \\
                    -e DISCORD_CLIENT_ID=${env.DISCORD_CLIENT_ID} \\
                    -e DISCORD_CLIENT_SECRET=${env.DISCORD_CLIENT_SECRET} \\
                    -e DISCORD_CLIENT_REDIRECT=${env.DISCORD_CLIENT_REDIRECT} \\
                    -e DISCORD_CLIENT_SCOPE=${env.DISCORD_CLIENT_SCOPE} \\
                    ${BACKEND_IMAGE_NAME}
                    """
                }
            }
        }

        stage('Run Frontend Container') {
            steps {
                script {
                    sh "docker run -d --name ${FRONTEND_CONTAINER_NAME} -p 3223:5173 ${FRONTEND_IMAGE_NAME}"
                }
            }
        }
    }
}
