#include "dock.hpp"
#include <QVBoxLayout>
#include <QLabel>
#include <obs-module.h>

namespace openfm {

OpenFMDock::OpenFMDock(QWidget *parent)
    : QDockWidget(parent)
    , web_view_(new QWebEngineView(this))
{
    setWindowTitle("OpenFM");
    setFeatures(QDockWidget::DockWidgetMovable | QDockWidget::DockWidgetFloatable);
    
    setup_ui();
    load_service_ui();
}

OpenFMDock::~OpenFMDock()
{
}

void OpenFMDock::setup_ui()
{
    auto *container = new QWidget(this);
    auto *layout = new QVBoxLayout(container);
    layout->setContentsMargins(0, 0, 0, 0);
    
    web_view_->setMinimumSize(400, 300);
    layout->addWidget(web_view_);
    
    setWidget(container);
    
    // Connect signals
    connect(web_view_, &QWebEngineView::loadFinished,
            this, &OpenFMDock::on_load_finished);
    connect(web_view_, &QWebEngineView::urlChanged,
            this, &OpenFMDock::on_url_changed);
}

void OpenFMDock::load_service_ui()
{
    // Load UI from local OpenFM service - point to player route
    const QString service_url = "http://127.0.0.1:6767/player";
    
    blog(LOG_INFO, "[OpenFM] Loading UI from %s", service_url.toStdString().c_str());
    web_view_->setUrl(QUrl(service_url));
}

void OpenFMDock::on_load_finished(bool ok)
{
    if (ok) {
        blog(LOG_INFO, "[OpenFM] UI loaded successfully");
    } else {
        blog(LOG_WARNING, "[OpenFM] Failed to load UI. Is the service running?");
        
        // Show error message in the dock
        auto *error_label = new QLabel(
            "OpenFM Service not running.\n\n"
            "Please start the OpenFM service:\n"
            "http://127.0.0.1:6767",
            this
        );
        error_label->setAlignment(Qt::AlignCenter);
        error_label->setStyleSheet(
            "color: white; "
            "background-color: #1a1a1a; "
            "padding: 20px; "
            "font-size: 14px;"
        );
        
        web_view_->hide();
        setWidget(error_label);
    }
}

void OpenFMDock::on_url_changed(const QUrl &url)
{
    blog(LOG_DEBUG, "[OpenFM] URL changed: %s", url.toString().toStdString().c_str());
}

} // namespace openfm

