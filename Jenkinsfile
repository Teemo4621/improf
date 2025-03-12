pipeline {
    agent {
        docker {
            image 'docker:latest'
            args '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
    },
    stages {
        stage('Deploy') {
            steps {
                script {
                    sh 'docker compose up -d'
                }
            }
        }
        stage('Check Status') {
            steps {
                script {
                    sh 'docker ps'
                }
            }
        }
    }
}
