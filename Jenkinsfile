pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d'
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
