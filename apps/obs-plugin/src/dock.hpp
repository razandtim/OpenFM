#pragma once

#include <QDockWidget>
#include <QWebEngineView>
#include <obs-frontend-api.h>

namespace openfm {

class OpenFMDock : public QDockWidget {
    Q_OBJECT

public:
    OpenFMDock(QWidget *parent = nullptr);
    ~OpenFMDock();

private:
    QWebEngineView *web_view_;
    
    void setup_ui();
    void load_service_ui();
    
private slots:
    void on_load_finished(bool ok);
    void on_url_changed(const QUrl &url);
};

} // namespace openfm

